import { useRef, type KeyboardEvent } from "react";

/*
 * Tab bar for the homepage demo section. Classes mirror the app's own
 * components/ui/tabs.tsx (shadcn/Radix Tabs) as rendered in the client app:
 *   TabsList    inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground
 *   TabsTrigger inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium
 *               data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm
 * Keyboard: Left/Right/Home/End move between tabs (Radix roving focus behaviour).
 */
export interface DemoTab {
  id: string;
  label: string;
}

export default function DemoSectionTabs({ tabs, value, onChange, idBase = "demo-tabs" }: { tabs: DemoTab[]; value: string; onChange: (id: string) => void; idBase?: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === value);
    let n = -1;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    if (n < 0) return;
    e.preventDefault();
    onChange(tabs[n].id);
    refs.current[n]?.focus();
  };
  return (
    <div className="ll-demo w-full pb-1" data-testid="demo-section-tabs">
      <div role="tablist" aria-label="Who DealLinq is for" onKeyDown={onKey} className="grid w-full grid-cols-3 items-stretch rounded-md bg-[hsl(210_20%_94%)] p-1 text-slate-500 lg:mx-auto lg:flex lg:h-10 lg:w-fit lg:items-center lg:justify-center">
        {tabs.map((t, i) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${idBase}-tab-${t.id}`}
              aria-selected={active}
              aria-controls={`${idBase}-panel-${t.id}`}
              tabIndex={active ? 0 : -1}
              data-state={active ? "active" : "inactive"}
              onClick={() => onChange(t.id)}
              className={`inline-flex min-h-[52px] w-full min-w-0 items-center justify-center whitespace-normal break-words rounded-sm px-1 py-2 text-center text-[11px] font-medium leading-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] focus-visible:ring-offset-2 lg:min-h-0 lg:w-auto lg:whitespace-nowrap lg:px-3 lg:py-1.5 lg:text-sm lg:leading-normal ${
                active ? "bg-white text-[#081729] shadow-sm" : "hover:text-[#081729]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
