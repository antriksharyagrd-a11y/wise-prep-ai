import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPublicProfile } from "@/lib/hirewise.functions";
import { HireWiseLogo } from "@/components/HireWiseLogo";
import { Award, Flame, Target } from "lucide-react";

export const Route = createFileRoute("/u/$username")({
  loader: async ({ params }) => {
    const r = await getPublicProfile({ data: { username: params.username } });
    if (!r) throw notFound();
    return r;
  },
  head: ({ loaderData, params }) => {
    const name = loaderData?.profile?.display_name || params.username;
    return {
      meta: [
        { title: `${name} on HireWise — Interview Readiness` },
        { name: "description", content: `${name}'s interview readiness on HireWise: streak, questions solved, mock interview average, and readiness score.` },
        { property: "og:title", content: `${name} on HireWise` },
        { property: "og:description", content: `Interview readiness score ${loaderData?.readiness ?? 0}. Streak ${loaderData?.streak?.current_streak ?? 0} days.` },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="text-center">
        <h1 className="text-3xl font-medium">No such profile</h1>
        <p className="mt-2 text-muted-foreground">This HireWise handle isn't taken yet.</p>
        <Link to="/" className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Home</Link>
      </div>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="text-center">
        <h1 className="text-2xl font-medium">Couldn't load profile</h1>
        <p className="mt-2 text-muted-foreground text-sm">{error.message}</p>
      </div>
    </main>
  ),
  component: PublicProfile,
});

function PublicProfile() {
  const { profile, streak, solved, avgInterview, resumeScore, readiness } = Route.useLoaderData();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-white/5 glass">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link to="/"><HireWiseLogo /></Link>
          <Link to="/auth" className="h-8 inline-flex items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors">Create your profile</Link>
        </div>
      </nav>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white text-3xl font-bold shadow-glow">
            {(profile.display_name ?? profile.username)[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-medium tracking-tight">{profile.display_name || profile.username}</h1>
            <p className="mt-1 text-sm text-muted-foreground font-mono">@{profile.username}</p>
            {profile.target_role && <p className="mt-2 text-sm">Targeting: <span className="text-electric-glow">{profile.target_role}</span></p>}
            {profile.bio && <p className="mt-3 text-sm text-foreground/90 max-w-xl">{profile.bio}</p>}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Readiness" value={String(readiness)} icon={Target} accent />
          <Stat label="Streak" value={`${streak?.current_streak ?? 0}d`} icon={Flame} />
          <Stat label="Solved" value={String(solved)} icon={Award} />
          <Stat label="Interview avg" value={avgInterview !== null ? `${avgInterview}/10` : "—"} icon={Award} />
        </div>

        {resumeScore !== null && (
          <p className="mt-6 text-sm text-muted-foreground">ATS resume score · <span className="text-foreground">{resumeScore}/100</span></p>
        )}

        <div className="mt-16 rounded-2xl border border-primary/20 bg-white/5 p-8 glass text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Recruiter-ready</p>
          <p className="mt-2 text-lg">This is a live snapshot of {profile.display_name || profile.username}'s prep signal.</p>
          <Link to="/auth" className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors">Build your own profile</Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, icon: Icon, accent }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border border-white/5 bg-white/5 p-5 glass ${accent ? "shadow-glow" : ""}`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <p className="mt-3 text-3xl font-medium tabular-nums">{value}</p>
    </div>
  );
}