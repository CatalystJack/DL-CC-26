import "./demo-scoped.css";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { BRAND_APP_HOST } from "@/config/brand";

/**
 * Renders children on a fixed-width canvas and scales it down (transform only)
 * to fit the available width. The reserved height uses the same scale to keep
 * every window at the same 16:10 desktop ratio.
 */
export function ScaleToFit({ width = 1440, height: canvasHeight = 900, children, className = "" }: { width?: number; height?: number; children: ReactNode; className?: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const measure = () => {
      const fitScale = Math.min(1, outer.clientWidth / width);
      const s = outer.clientWidth < 1024 ? Math.max(0.65, fitScale) : fitScale;
      setScale(s);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={outerRef} className={`ll-demo-scale-viewport relative w-full overflow-x-auto overflow-y-hidden ${className}`} style={{ height: canvasHeight * scale, aspectRatio: `${width} / ${canvasHeight}` }}>
      <div
        className="absolute left-0 top-0"
        style={{ width, height: canvasHeight, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}

export function PauseButton({ paused, onToggle, dark = false }: { paused: boolean; onToggle: () => void; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      aria-label={paused ? "Play product animation" : "Pause product animation"}
      className={`inline-flex h-6 min-h-0 w-6 min-w-0 shrink-0 items-center justify-center rounded-full border p-0 transition-colors ${
        dark ? "border-white/30 text-white hover:bg-white/10" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
      }`}
    >
      {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
    </button>
  );
}

interface MockWindowProps {
  /** path shown in the URL pill, e.g. "/admin/master-pipeline" */
  path: string;
  children: ReactNode;
  paused?: boolean;
  onTogglePause?: () => void;
  className?: string;
}

/** Browser-window chrome around a product recreation. */
export function MockWindow({ path, children, paused, onTogglePause, className = "" }: MockWindowProps) {
  return (
    <div className={`ll-mock-window flex h-[900px] w-[1440px] min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-[#0A2B4A] shadow-2xl ${className}`}>
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex min-w-0 max-w-[420px] flex-1 items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-500" aria-hidden="true">
          <span className="truncate">{BRAND_APP_HOST}{path}</span>
        </div>
        <div className="flex items-center gap-2">
          {onTogglePause && <PauseButton paused={!!paused} onToggle={onTogglePause} />}
        </div>
      </div>
      <div className="ll-mock-window-content min-h-0 flex-1 [&>*]:h-full">{children}</div>
    </div>
  );
}
