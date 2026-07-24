import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { getProgress } from "@/lib/hirewise.functions";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({ meta: [{ title: "Progress — HireWise" }, { name: "description", content: "Track questions solved over time, mock interview scores, and topic-wise strengths." }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const fn = useServerFn(getProgress);
  const { data } = useQuery({ queryKey: ["progress"], queryFn: () => fn() });
  if (!data) return <div className="mx-auto max-w-7xl px-6"><div className="h-64 animate-pulse rounded-2xl bg-white/5" /></div>;

  // Solved over time: bucket by day
  const byDay = new Map<string, number>();
  for (const a of data.attempts) {
    const d = new Date(a.created_at).toISOString().slice(0, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + 1);
  }
  const solvedSeries = Array.from(byDay.entries()).map(([date, count]) => ({ date, count }));

  // Topic breakdown radar
  const byTopic = new Map<string, number>();
  for (const a of data.attempts) {
    const t = (a.question as any)?.topic ?? "Other";
    byTopic.set(t, (byTopic.get(t) ?? 0) + 1);
  }
  const radar = Array.from(byTopic.entries()).map(([topic, value]) => ({ topic, value }));

  const interviewSeries = data.interviews.map((i: any) => ({ date: new Date(i.created_at).toISOString().slice(0, 10), score: i.score }));

  // Streak calendar: last 12 weeks x 7 days
  const days: Array<{ date: string; count: number }> = [];
  const now = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({ date: iso, count: byDay.get(iso) ?? 0 });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Analytics</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">Progress</h1>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
        <h3 className="text-sm font-medium mb-4">Activity — last 12 weeks</h3>
        <div className="flex flex-wrap gap-1">
          {days.map((d) => {
            const shade = d.count === 0 ? "bg-white/5" : d.count === 1 ? "bg-primary/30" : d.count === 2 ? "bg-primary/60" : "bg-primary shadow-glow";
            return <div key={d.date} title={`${d.date}: ${d.count}`} className={`size-3 rounded-sm ${shade}`} />;
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
          <h3 className="text-sm font-medium mb-4">Questions solved over time</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={solvedSeries}>
                <CartesianGrid stroke="#ffffff10" />
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #ffffff10", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="#60A5FA" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
          <h3 className="text-sm font-medium mb-4">Mock interview scores</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={interviewSeries}>
                <CartesianGrid stroke="#ffffff10" />
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis domain={[0, 10]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #ffffff10", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#60A5FA", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
        <h3 className="text-sm font-medium mb-4">Topic strength</h3>
        <div className="h-80">
          <ResponsiveContainer>
            <RadarChart data={radar}>
              <PolarGrid stroke="#ffffff15" />
              <PolarAngleAxis dataKey="topic" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Radar dataKey="value" stroke="#60A5FA" fill="#3B82F6" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}