import { cn } from "@/lib/utils";

export function HireWiseLogo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex size-9 items-center justify-center rounded-lg bg-gradient-brand ring-1 ring-white/25 shadow-glow">
        <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* circuit head silhouette */}
          <path d="M4 14c0-4.4 3.6-8 8-8 2.2 0 4.2.9 5.7 2.3" opacity="0.85" />
          <path d="M8 18v2M11 20v-2M14 20v-2" opacity="0.6" />
          {/* upward growth arrow */}
          <path d="M13 15l3-3 3 3M16 12v8" />
          <circle cx="10" cy="10" r="1" fill="currentColor" />
        </svg>
      </div>
      {showText && (
        <span className="text-lg font-semibold tracking-tight">
          Hire<span className="text-gradient-brand">Wise</span>
        </span>
      )}
    </div>
  );
}