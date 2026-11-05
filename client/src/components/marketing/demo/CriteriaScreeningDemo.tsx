import type { ReactNode } from "react";
import { AnimatePresence, LazyMotion, domMax, m } from "framer-motion";
import { Check, CheckCircle2, Plus, Save, Settings2, Trash2 } from "lucide-react";
import { BRAND_NAME } from "@/config/brand";
import { MockWindow, ScaleToFit } from "./MockWindow";
import { PageHeader } from "./ui-replicas";
import { AnalystHeader, AnalystTable, AnalystToolbar, ClientShell, DealDrawer } from "./DealDashboardParts";
import type { DemoDeal } from "./demo-data";
import { useDemoDataset } from "./demo-dataset";
import { T_ENTER, useDemoTimeline, useStreamText } from "./useDemoTimeline";

/*
 * Screening, investment-company (client) view only:
 *   pages/developer-criteria-settings.tsx (/developer/criteria, the group's own acquisition criteria)
 *   -> pages/analyst-dashboard.tsx (/developer/dashboard) + its deal detail drawer.
 * Steps: 1-3 the incoming deal is checked against market, acreage and rent rules
 *        4 back on the dashboard, both new deals still "?" · 5 classified: #1042 R, #1039 X
 *        6 deal drawer opens: "Potential" + "Target Market", AI Analysis streams
 */
const CUES = [900, 1900, 2900, 4300, 5100, 6100, 12200];

const ARIA = `Animated preview of an investment company's ${BRAND_NAME} Criteria page and Deal Dashboard: an incoming deal is checked against the group's target markets, acreage range and minimum rent, then marked Review while another deal is marked Passed, with each decision explained in the deal drawer.`;

export default function CriteriaScreeningDemo() {
  const tl = useDemoTimeline<HTMLDivElement>({ cues: CUES, totalMs: 14000, mobileCues: CUES, mobileTotalMs: 14000 });
  const { step, reduced, loopKey } = tl;
  const { newDeal: DEMO_NEW_DEAL, passedDeal: DEMO_PASSED_DEAL, deals: DEMO_DEALS, aiReview: DEMO_AI_REVIEW } = useDemoDataset();
  const onDash = step >= 4;
  const classified = step >= 5;
  const a: DemoDeal = { ...DEMO_NEW_DEAL, status: classified ? "reviewing" : "unclassified" };
  const b: DemoDeal = { ...DEMO_PASSED_DEAL, status: classified ? "passed" : "unclassified" };
  const rows = [a, b, ...DEMO_DEALS.filter((d) => d.id !== DEMO_PASSED_DEAL.id).slice(0, 5)];
  const ai = useStreamText(DEMO_AI_REVIEW, step >= 6, { msPerToken: 38, reduced });

  return (
    <LazyMotion features={domMax} strict>
      <div ref={tl.ref} className="ll-demo relative w-full" data-testid="demo-criteria-screening">
        <ScaleToFit>
          <MockWindow path={onDash ? "/developer/dashboard" : "/developer/criteria"} paused={tl.paused} onTogglePause={reduced ? undefined : tl.togglePause}>
            <div role="img" aria-label={ARIA}>
              <m.div key={loopKey} aria-hidden="true" initial={reduced || loopKey === 0 ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <ClientShell
                  active={onDash ? "Deal Dashboard" : "Criteria"}
                  expanded
                  bg={onDash ? "bg-[#fbfaf8]" : "bg-slate-50"}
                  overlay={<AnimatePresence>{step >= 6 && <DealDrawer key="drawer" deal={a} aiText={ai.text} reduced={reduced} />}</AnimatePresence>}
                >
                  <AnimatePresence initial={false} mode="wait">
                    {onDash ? (
                      <m.div key="dash" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                        <AnalystHeader />
                        <AnalystToolbar reduced={reduced} />
                        <AnalystTable rows={rows} reduced={reduced} selectedId={step >= 6 ? a.id : undefined} hideCols={["name", "broker"]} />
                      </m.div>
                    ) : (
                      <m.div key="criteria" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                        <CriteriaPage step={step} reduced={reduced} />
                      </m.div>
                    )}
                  </AnimatePresence>
                </ClientShell>
              </m.div>
            </div>
          </MockWindow>
        </ScaleToFit>
      </div>
    </LazyMotion>
  );
}

/* ---------------- pages/developer-criteria-settings.tsx (criteriaOnly) ---------------- */

const PRIMARY = "#0A2B4A";
const SECONDARY = "#4A90E2";

function Label({ children }: { children: ReactNode }) {
  return <p className="text-xs font-medium text-slate-700">{children}</p>;
}
function Field({ value, hit, className = "" }: { value: string; hit?: boolean; className?: string }) {
  return (
    <div
      className={`mt-1.5 flex h-9 items-center rounded-md border bg-white px-3 text-sm transition-all duration-300 ${
        hit ? "border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900" : "border-[hsl(220_13%_91%)] text-slate-800"
      } ${className}`}
    >
      {value}
    </div>
  );
}

/** Demo annotation: what the incoming deal scored on that rule. */
function CheckTag({ show, children, reduced }: { show: boolean; children: ReactNode; reduced: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <m.span
          initial={reduced ? false : { opacity: 0, y: 4, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={T_ENTER}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow"
        >
          <Check className="h-3 w-3" strokeWidth={3} />
          {children}
        </m.span>
      )}
    </AnimatePresence>
  );
}

function CriteriaPage({ step, reduced }: { step: number; reduced: boolean }) {
  const { criteria: DEMO_CRITERIA, newDeal: DEMO_NEW_DEAL } = useDemoDataset();
  const garden = DEMO_CRITERIA.productTypes[0];
  const perUnit = DEMO_CRITERIA.rentMetric === "per_unit";
  return (
    <div>
      <div className="relative z-10 -mx-5 -mt-5 bg-slate-50 px-5 pt-5">
      <PageHeader
        compact
        title="Criteria"
        actions={
          <span className="inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
            <Save className="mr-2 h-4 w-4" />Save criteria
          </span>
        }
      />

      {/* incoming deal being screened (demo annotation) */}
      <AnimatePresence>
        {step >= 1 && (
          <m.div
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={T_ENTER}
            className="mb-3 flex items-center justify-between rounded-xl border border-[#3286C8]/40 bg-[#3286C8]/10 px-4 py-2 text-xs text-[#0A2B4A]"
          >
            <span>
              <span className="font-semibold">Screening new deal #{DEMO_NEW_DEAL.id}</span> · {DEMO_CRITERIA.screeningLine}
            </span>
            <span className="font-semibold">{step >= 3 ? "3 of 3 rules met" : `${step} of 3 rules checked`}</span>
          </m.div>
        )}
      </AnimatePresence>
      </div>

      {/* page scrolls down to the product-type rules once location checks pass */}
      <m.div initial={false} animate={{ y: step >= 2 ? -250 : 0 }} transition={{ duration: reduced ? 0 : 0.7, ease: [0.4, 0, 0.2, 1] }}>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start gap-3 p-5 pb-3">
          <div className="rounded-xl p-2" style={{ backgroundColor: `${SECONDARY}18`, color: PRIMARY }}><Settings2 className="h-5 w-5" /></div>
          <div>
            <p className="text-lg font-semibold leading-none tracking-tight text-[#081729]">Criteria</p>
            <p className="mt-1.5 text-sm text-slate-500">These rules determine each deal’s profile-specific classification.</p>
          </div>
        </div>
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label>Target states</Label>
              <div className="mt-1.5 flex h-9 items-center gap-1.5 rounded-md border border-[hsl(220_13%_91%)] bg-white px-2">
                {DEMO_CRITERIA.states.map((s) => (
                  <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>County markets</Label>
                <CheckTag show={step >= 1} reduced={reduced}>{DEMO_CRITERIA.marketCheck}</CheckTag>
              </div>
              <div className={`mt-1.5 flex h-9 items-center gap-1.5 rounded-md border bg-white px-2 transition-all duration-300 ${step >= 1 ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-[hsl(220_13%_91%)]"}`}>
                {DEMO_CRITERIA.counties.map((c, i) => (
                  <span key={c} className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-300 ${i === 0 && step >= 1 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Rent metric</Label>
            <div className="mt-1.5 grid grid-cols-2 gap-3">
              {[
                { t: "Rent Comps — Min $/SF", d: "Use minimum rent per square foot as the primary test.", on: !perUnit },
                { t: "Rent Comps — Min $/Unit (Avg)", d: "Use average minimum rent per unit as the primary test.", on: perUnit },
              ].map((o) => (
                <div key={o.t} className={`rounded-lg p-3 ${o.on ? "border-2 bg-slate-50" : "border border-slate-200 bg-white"}`} style={o.on ? { borderColor: SECONDARY } : undefined}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900">{o.t}</span>
                    {o.on && <Check className="h-4 w-4" style={{ color: SECONDARY }} />}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{o.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div><Label>Comparable search radius (miles) <span className="text-red-500">*</span></Label><Field value={String(DEMO_CRITERIA.radius)} /></div>
            <div><Label>Minimum comp vintage year <span className="text-red-500">*</span></Label><Field value={String(DEMO_CRITERIA.vintage)} /></div>
            <div><Label>Minimum comp units <span className="text-red-500">*</span></Label><Field value={String(DEMO_CRITERIA.minUnits)} /></div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Product types</h3>
                <p className="text-sm text-slate-500">A deal is marked Review when it clears the acreage and rent criteria for any active product type.</p>
              </div>
              <span className="inline-flex h-8 shrink-0 items-center rounded-full border border-[#b8c9d8] bg-white px-3 text-xs font-semibold text-[#081729]"><Plus className="mr-1 h-3.5 w-3.5" />Add product type</span>
            </div>
            <div className={`rounded-2xl border bg-white p-4 shadow-sm transition-colors duration-300 ${step >= 3 ? "border-emerald-400" : "border-slate-200"}`}>
              <div className="grid grid-cols-[1.2fr_0.6fr_0.6fr_0.8fr_0.8fr_auto] items-end gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Label>Product type <span className="text-red-500">*</span></Label>
                    {garden.isDefault && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">Normal (Default)</span>}
                  </div>
                  <Field value={garden.name} />
                </div>
                <div className="relative">
                  <Label>Min acres <span className="text-red-500">*</span></Label>
                  <Field value={String(garden.minAcres)} hit={step >= 2} />
                </div>
                <div><Label>Max acres</Label><Field value={String(garden.maxAcres)} hit={step >= 2} /></div>
                <div><Label>Min rent $/SF {!perUnit && <span className="text-red-500">*</span>}</Label><Field value={garden.minPsf} hit={!perUnit && step >= 3} /></div>
                <div><Label>Min rent $/Unit {perUnit && <span className="text-red-500">*</span>}</Label><Field value={garden.minUnit} hit={perUnit && step >= 3} /></div>
                <span className="mb-2 p-1"><Trash2 className="h-4 w-4 text-slate-400" /></span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <CheckTag show={step >= 2} reduced={reduced}>{DEMO_CRITERIA.acreageCheck}</CheckTag>
                <CheckTag show={step >= 3} reduced={reduced}>{DEMO_CRITERIA.rentCheck}</CheckTag>
                <AnimatePresence>
                  {step >= 3 && (
                    <m.span initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />{DEMO_CRITERIA.clears}
                    </m.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm">
              <span className="font-medium text-slate-800">{DEMO_CRITERIA.productTypes[1].name}</span>
              <span className="text-xs">{DEMO_CRITERIA.productTypes[1].minAcres}–{DEMO_CRITERIA.productTypes[1].maxAcres} ac · min {perUnit ? `$${DEMO_CRITERIA.productTypes[1].minUnit}/unit` : `$${DEMO_CRITERIA.productTypes[1].minPsf}/SF`}</span>
            </div>
          </div>
        </div>
      </div>
      </m.div>
    </div>
  );
}
