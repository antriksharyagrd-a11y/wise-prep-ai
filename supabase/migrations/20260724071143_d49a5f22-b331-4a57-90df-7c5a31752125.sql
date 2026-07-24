
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  target_role TEXT,
  bio TEXT,
  dark_mode BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are public" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- QUESTIONS BANK
CREATE TYPE public.difficulty AS ENUM ('Easy', 'Medium', 'Hard');

CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  difficulty difficulty NOT NULL,
  topic TEXT NOT NULL,
  description TEXT NOT NULL,
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  starter_code JSONB NOT NULL DEFAULT '{}'::jsonb,
  hints TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.questions TO anon, authenticated;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are public" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Admins manage questions" ON public.questions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- DAILY QUESTION mapping (deterministic rotation)
CREATE TABLE public.daily_questions (
  day DATE PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE
);
GRANT SELECT ON public.daily_questions TO anon, authenticated;
GRANT ALL ON public.daily_questions TO service_role;
ALTER TABLE public.daily_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Daily questions are public" ON public.daily_questions FOR SELECT USING (true);

-- QUESTION ATTEMPTS
CREATE TABLE public.question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  language TEXT NOT NULL DEFAULT 'javascript',
  code TEXT NOT NULL DEFAULT '',
  solved BOOLEAN NOT NULL DEFAULT false,
  ai_explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.question_attempts TO authenticated;
GRANT ALL ON public.question_attempts TO service_role;
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own attempts" ON public.question_attempts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ON public.question_attempts (user_id, created_at DESC);

-- MOCK INTERVIEWS
CREATE TABLE public.mock_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_domain TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  transcript JSONB NOT NULL DEFAULT '[]'::jsonb,
  score INT,
  strengths TEXT[],
  weaknesses TEXT[],
  suggestions TEXT[],
  summary TEXT,
  confidence_avg NUMERIC(4,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mock_interviews TO authenticated;
GRANT ALL ON public.mock_interviews TO service_role;
ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own interviews" ON public.mock_interviews FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ON public.mock_interviews (user_id, created_at DESC);

-- RESUMES
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  target_role TEXT,
  extracted_text TEXT,
  ats_score INT,
  feedback JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own resumes" ON public.resumes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ON public.resumes (user_id, created_at DESC);

-- STREAKS
CREATE TABLE public.streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_active_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.streaks TO anon;
GRANT SELECT, INSERT, UPDATE ON public.streaks TO authenticated;
GRANT ALL ON public.streaks TO service_role;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Streaks are public" ON public.streaks FOR SELECT USING (true);
CREATE POLICY "Users update own streak" ON public.streaks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER t_profiles_upd BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
CREATE TRIGGER t_attempts_upd BEFORE UPDATE ON public.question_attempts FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
CREATE TRIGGER t_interviews_upd BEFORE UPDATE ON public.mock_interviews FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- Auto-create profile & default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  base TEXT;
  candidate TEXT;
  i INT := 0;
BEGIN
  base := lower(regexp_replace(coalesce(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'user'), '[^a-z0-9]+', '', 'g'));
  IF base = '' THEN base := 'user'; END IF;
  candidate := base;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = candidate) LOOP
    i := i + 1;
    candidate := base || i::text;
  END LOOP;
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (NEW.id, candidate, coalesce(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', candidate), NEW.raw_user_meta_data->>'avatar_url');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  INSERT INTO public.streaks (user_id) VALUES (NEW.id);
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Streak bump helper
CREATE OR REPLACE FUNCTION public.bump_streak(_user_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  s public.streaks%ROWTYPE;
  today DATE := (now() AT TIME ZONE 'UTC')::date;
BEGIN
  SELECT * INTO s FROM public.streaks WHERE user_id = _user_id FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.streaks(user_id, current_streak, longest_streak, last_active_date)
    VALUES (_user_id, 1, 1, today);
    RETURN;
  END IF;
  IF s.last_active_date = today THEN
    RETURN;
  ELSIF s.last_active_date = today - 1 THEN
    UPDATE public.streaks SET current_streak = s.current_streak + 1,
      longest_streak = GREATEST(s.longest_streak, s.current_streak + 1),
      last_active_date = today, updated_at = now() WHERE user_id = _user_id;
  ELSE
    UPDATE public.streaks SET current_streak = 1,
      longest_streak = GREATEST(s.longest_streak, 1),
      last_active_date = today, updated_at = now() WHERE user_id = _user_id;
  END IF;
END $$;
GRANT EXECUTE ON FUNCTION public.bump_streak(UUID) TO authenticated;

-- SEED QUESTIONS
INSERT INTO public.questions (slug, title, difficulty, topic, description, examples, starter_code, hints) VALUES
('two-sum', 'Two Sum', 'Easy', 'Arrays', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.', '[{"input":"nums=[2,7,11,15], target=9","output":"[0,1]"},{"input":"nums=[3,2,4], target=6","output":"[1,2]"}]', '{"javascript":"function twoSum(nums, target) {\n  // your code here\n}","python":"def two_sum(nums, target):\n    # your code here\n    pass","typescript":"function twoSum(nums: number[], target: number): number[] {\n  // your code here\n  return [];\n}"}', ARRAY['Try a hash map for O(n) time.','What have you seen before as you iterate?']),
('valid-parentheses', 'Valid Parentheses', 'Easy', 'Stacks', 'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid. An input string is valid if brackets are closed by the same type and in the correct order.', '[{"input":"s=\"()[]{}\"","output":"true"},{"input":"s=\"(]\"","output":"false"}]', '{"javascript":"function isValid(s) {\n  // your code here\n}","python":"def is_valid(s):\n    pass"}', ARRAY['Use a stack.','Match each closing bracket with the last opened one.']),
('reverse-linked-list', 'Reverse Linked List', 'Easy', 'Linked Lists', 'Given the head of a singly linked list, reverse the list and return the new head.', '[{"input":"head=[1,2,3,4,5]","output":"[5,4,3,2,1]"}]', '{"javascript":"function reverseList(head) {\n  // your code here\n}","python":"def reverse_list(head):\n    pass"}', ARRAY['Iterate with prev/curr/next pointers.','Recursion also works if you unwind the base case carefully.']),
('best-time-to-buy-sell-stock', 'Best Time to Buy and Sell Stock', 'Easy', 'Arrays', 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.', '[{"input":"prices=[7,1,5,3,6,4]","output":"5"}]', '{"javascript":"function maxProfit(prices) {\n  // your code here\n}","python":"def max_profit(prices):\n    pass"}', ARRAY['Track the running minimum.','One pass is enough.']),
('longest-substring', 'Longest Substring Without Repeating Characters', 'Medium', 'Strings', 'Given a string s, find the length of the longest substring without repeating characters.', '[{"input":"s=\"abcabcbb\"","output":"3"},{"input":"s=\"bbbbb\"","output":"1"}]', '{"javascript":"function lengthOfLongestSubstring(s) {\n  // your code here\n}","python":"def length_of_longest_substring(s):\n    pass"}', ARRAY['Sliding window with a hash set.','Move the left pointer past the previous duplicate.']),
('lru-cache', 'LRU Cache', 'Hard', 'Design', 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get(key) and put(key, value), both O(1).', '[{"input":"cap=2; put(1,1); put(2,2); get(1); put(3,3); get(2)","output":"1, then -1"}]', '{"javascript":"class LRUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}","python":"class LRUCache:\n    def __init__(self, capacity):\n        pass"}', ARRAY['HashMap + doubly linked list.','JavaScript Map preserves insertion order — cheat mode.']),
('coin-change', 'Coin Change', 'Medium', 'Dynamic Programming', 'You are given coins of different denominations and a total amount. Return the fewest number of coins needed to make up that amount. If impossible, return -1.', '[{"input":"coins=[1,2,5], amount=11","output":"3"}]', '{"javascript":"function coinChange(coins, amount) {\n  // your code here\n}","python":"def coin_change(coins, amount):\n    pass"}', ARRAY['Bottom-up DP: dp[a] = min(dp[a - c] + 1).','Initialize with Infinity, watch the base case.']),
('binary-tree-level-order', 'Binary Tree Level Order Traversal', 'Medium', 'Trees', 'Given the root of a binary tree, return the level order traversal of its nodes'' values (i.e., from left to right, level by level).', '[{"input":"root=[3,9,20,null,null,15,7]","output":"[[3],[9,20],[15,7]]"}]', '{"javascript":"function levelOrder(root) {\n  // your code here\n}","python":"def level_order(root):\n    pass"}', ARRAY['BFS with a queue.','Track level size per iteration.']),
('word-break', 'Word Break', 'Medium', 'Dynamic Programming', 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.', '[{"input":"s=\"leetcode\", wordDict=[\"leet\",\"code\"]","output":"true"}]', '{"javascript":"function wordBreak(s, wordDict) {\n  // your code here\n}","python":"def word_break(s, wordDict):\n    pass"}', ARRAY['dp[i] = true if some j has dp[j] && s[j..i] in dict.']),
('median-two-sorted', 'Median of Two Sorted Arrays', 'Hard', 'Binary Search', 'Given two sorted arrays nums1 and nums2 of size m and n, return the median of the two sorted arrays in O(log(min(m,n))) time.', '[{"input":"nums1=[1,3], nums2=[2]","output":"2.0"}]', '{"javascript":"function findMedianSortedArrays(a, b) {\n  // your code here\n}","python":"def find_median_sorted_arrays(a, b):\n    pass"}', ARRAY['Binary search the partition on the shorter array.']),
('number-of-islands', 'Number of Islands', 'Medium', 'Graphs', 'Given an m x n 2D binary grid which represents a map of ''1''s (land) and ''0''s (water), return the number of islands.', '[{"input":"grid=[[\"1\",\"1\",\"0\"],[\"1\",\"0\",\"0\"],[\"0\",\"0\",\"1\"]]","output":"2"}]', '{"javascript":"function numIslands(grid) {\n  // your code here\n}","python":"def num_islands(grid):\n    pass"}', ARRAY['DFS/BFS from every unvisited land cell.']),
('merge-intervals', 'Merge Intervals', 'Medium', 'Arrays', 'Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.', '[{"input":"[[1,3],[2,6],[8,10],[15,18]]","output":"[[1,6],[8,10],[15,18]]"}]', '{"javascript":"function merge(intervals) {\n  // your code here\n}","python":"def merge(intervals):\n    pass"}', ARRAY['Sort by start, then sweep.']);

-- Pre-seed today's daily question
INSERT INTO public.daily_questions (day, question_id)
SELECT (now() AT TIME ZONE 'UTC')::date, id FROM public.questions ORDER BY random() LIMIT 1;
