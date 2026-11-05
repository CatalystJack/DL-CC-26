import { LazyMotion, domMax, m } from "framer-motion";
import { BRAND_NAME } from "@/config/brand";
import { MockWindow, ScaleToFit } from "./MockWindow";
import { AnalystHeader, AnalystTable, AnalystToolbar, ClientShell, type FilterKey } from "./DealDashboardParts";
import { useDemoDataset } from "./demo-dataset";
import { useDemoTimeline } from "./useDemoTimeline";

/*
 * Filters on the investment group's own dashboard (pages/analyst-dashboard.tsx):
 * Status / Priority / Type popover filters, exactly as the client sees them.
 * Steps: 1 Status popover opens · 2 "Reviewing" checked -> navy "Status (1)", rows narrow
 *        3 popover closes · 4 Type popover opens · 5 "Land" checked -> sky "Type (1)" · 6 closes
 */
const CUES = [1000, 2000, 3000, 3700, 4700, 5600, 9800];

const aria = (type: string) => `Animated preview of an investment company's ${BRAND_NAME} Deal Dashboard: the Status filter is set to Reviewing and the Type filter to ${type}, and the deal table narrows to matching deals.`;

export default function DashboardFilterDemo() {
  const tl = useDemoTimeline<HTMLDivElement>({ cues: CUES, totalMs: 11500, mobileCues: CUES, mobileTotalMs: 11500 });
  const { step, reduced, loopKey } = tl;
  const ds = useDemoDataset();
  const ALL = [ds.newDeal, ...ds.deals];
  const ARIA = aria(ds.typeFilter.label);
  const statusSel = step >= 2 ? ["reviewing"] : [];
  const typeSel = step >= 5 ? [ds.typeFilter.label] : [];
  const open: FilterKey | undefined = step === 1 || step === 2 ? "status" : step === 4 || step === 5 ? "type" : undefined;
  const rows = ALL.slice(0, 7);

  return (
    <LazyMotion features={domMax} strict>
      <div ref={tl.ref} className="ll-demo relative w-full" data-testid="demo-dashboard-filter">
        <ScaleToFit>
          <MockWindow path="/developer/dashboard" paused={tl.paused} onTogglePause={reduced ? undefined : tl.togglePause}>
            <div role="img" aria-label={ARIA}>
              <m.div key={loopKey} aria-hidden="true" initial={reduced || loopKey === 0 ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <ClientShell active="Deal Dashboard" expanded>
                  <AnalystHeader />
                  <AnalystToolbar statusSel={statusSel} typeSel={typeSel} open={open} reduced={reduced} />
                  <AnalystTable rows={rows} reduced={reduced} hideCols={["name", "broker"]} />
                </ClientShell>
              </m.div>
            </div>
          </MockWindow>
        </ScaleToFit>
      </div>
    </LazyMotion>
  );
}
