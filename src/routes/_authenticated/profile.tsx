import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getDashboard, updateProfile } from "@/lib/hirewise.functions";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — HireWise" }, { name: "description", content: "Edit your public HireWise profile." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const fn = useServerFn(getDashboard);
  const update = useServerFn(updateProfile);
  const { data, refetch } = useQuery({ queryKey: ["dashboard"], queryFn: () => fn() });
  const p = data?.profile;
  const [form, setForm] = useState({ username: "", display_name: "", target_role: "", bio: "" });
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (p) setForm({ username: p.username ?? "", display_name: p.display_name ?? "", target_role: p.target_role ?? "", bio: p.bio ?? "" });
  }, [p]);
  if (!p) return <div className="mx-auto max-w-2xl px-6"><div className="h-64 animate-pulse rounded-2xl bg-white/5" /></div>;
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try { await update({ data: form }); toast.success("Profile updated"); await refetch(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(false); }
  }
  return (
    <div className="mx-auto max-w-2xl px-6">
      <form onSubmit={submit} className="rounded-2xl border border-white/5 bg-white/5 p-8 glass space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Public profile</p>
          <h1 className="mt-1 text-2xl font-medium">Edit profile</h1>
          <p className="mt-1 text-xs text-muted-foreground">Public URL: <span className="font-mono">/u/{form.username}</span></p>
        </div>
        <Field label="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} placeholder="alex" />
        <Field label="Display name" value={form.display_name} onChange={(v) => setForm({ ...form, display_name: v })} placeholder="Alex Chen" />
        <Field label="Target role" value={form.target_role} onChange={(v) => setForm({ ...form, target_role: v })} placeholder="Senior Frontend Engineer" />
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={280} rows={3} className="mt-2 w-full rounded-md bg-input px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-primary outline-none" />
        </div>
        <button disabled={busy} className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium ring-1 ring-electric-glow/40 hover:bg-electric-glow disabled:opacity-60">{busy ? "Saving…" : "Save"}</button>
      </form>
    </div>
  );
}
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full h-10 rounded-md bg-input px-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none" />
    </div>
  );
}