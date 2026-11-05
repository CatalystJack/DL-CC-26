import { AnimatePresence, LazyMotion, domMax, m } from "framer-motion";
import { GripVertical, Plus, Search, Trash2, X } from "lucide-react";
import { BRAND_NAME } from "@/config/brand";
import { MockWindow, ScaleToFit } from "./MockWindow";
import { AppToast, Btn, PageHeader, SALES_NAV, SelectBox } from "./ui-replicas";
import { ClientShell } from "./DealDashboardParts";
import { BOOKKEEPING_BRAND, SALES_DRAG_ID, SALES_NEW_OPP, SALES_OPPS, SALES_STAGES, usd, type SalesOpportunity, type SalesStageId } from "./sales-demo-data";
import { T_ENTER, T_LAYOUT, useCountUp, useDemoTimeline, useStreamText } from "./useDemoTimeline";

/*
 * General Sales profile (profileType "general_sales"): pages/developer-pipeline.tsx at /developer/pipeline,
 * inside components/developer-navigation.tsx (General Sales nav: Home, Pipeline, CRM, Outreach, Analytics, Settings).
 * Stage names are configured by each company; the four shown are invented demo stages.
 * Steps: 1 summary counts up · 2 New Opportunity dialog · 3 contact chosen · 4 title typed · 5 value
 *        6 Create -> toast + card lands in the first stage · 7 a card is dragged to the next stage · 8 settle
 */
const CUES = [400, 1800, 2900, 3700, 5000, 6000, 8600, 9600];
const PIPELINE_FILL: SalesOpportunity[] = [
  { id: "o8", title: "Quarterly bookkeeping – Hawthorne Hardware", contact: "Elise Warren", email: "elise@hawthornehardware.com", value: 12600, stage: "lead", updated: "10/23/2026" },
  { id: "o9", title: "Payroll services – Blue Ridge Pediatrics", contact: "Marcus Bell", email: "marcus@blueridgepediatrics.com", value: 19200, stage: "discovery", updated: "10/21/2026" },
  { id: "o10", title: "Monthly close – Magnolia Market Café", contact: "Renee Foster", email: "renee@magnoliamarketcafe.com", value: 7800, stage: "proposal", updated: "10/18/2026" },
];

const ARIA = `Animated preview of a bookkeeping firm's ${BRAND_NAME} sales Pipeline: opportunity totals count up, a new opportunity is created for a CRM contact and lands in the first stage, and another opportunity is dragged to the Proposal sent stage.`;

export default function SalesPipelineDemo() {
  const tl = useDemoTimeline<HTMLDivElement>({ cues: CUES, totalMs: 13500, mobileCues: CUES, mobileTotalMs: 13500 });
  const { step, reduced, loopKey } = tl;
  const created = step >= 6;
  const dragged = step >= 7;
  const opps: SalesOpportunity[] = [
    ...(created ? [SALES_NEW_OPP] : []),
    ...SALES_OPPS.map((o) => (o.id === SALES_DRAG_ID && dragged ? { ...o, stage: "proposal" as SalesStageId, updated: "10/24/2026" } : o)),
    ...PIPELINE_FILL,
  ];
  const total = opps.length;
  const totalValue = opps.reduce((s, o) => s + o.value, 0);
  const won = opps.filter((o) => o.stage === "won").length;
  const countTotal = useCountUp(total, step >= 1, { duration: 900, reduced });
  const countValue = useCountUp(totalValue, step >= 1, { duration: 900, reduced });
  const countWon = useCountUp(won, step >= 1, { duration: 900, reduced });
  const dialog = step >= 2 && step < 6;

  return (
    <LazyMotion features={domMax} strict>
      <div ref={tl.ref} className="ll-demo relative w-full" data-testid="demo-sales-pipeline">
        <ScaleToFit>
          <MockWindow path="/developer/pipeline" paused={tl.paused} onTogglePause={reduced ? undefined : tl.togglePause}>
            <div role="img" aria-label={ARIA}>
              <m.div key={loopKey} className="h-full min-h-0" aria-hidden="true" initial={reduced || loopKey === 0 ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <ClientShell
                  active="Pipeline"
                  expanded
                  nav={SALES_NAV}
                  brand={BOOKKEEPING_BRAND}
                  overlay={
                    <>
                      <AnimatePresence>{dialog && <NewOppDialog key="dlg" step={step} reduced={reduced} />}</AnimatePresence>
                      <AnimatePresence>
                        {step >= 6 && step < 8 && (
                          <m.div key="toast" className="absolute bottom-5 right-5 z-40" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={T_ENTER}>
                            <AppToast title="Opportunity created" description="The opportunity was added to your pipeline." />
                          </m.div>
                        )}
                      </AnimatePresence>
                    </>
                  }
                >
                  <div className="ll-sales-pipeline-layout">
                  <PageHeader
                    compact
                    eyebrow="Sales workspace"
                    title="Pipeline"
                    description="Track opportunities from first contact through close, independent of deal classification."
                    actions={
                      <>
                        <Btn variant="outline">Manage Stages</Btn>
                        <Btn variant="outline"><Plus className="mr-2 h-4 w-4" />New Opportunity</Btn>
                      </>
                    }
                  />
                  <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div className="grid flex-1 grid-cols-3 gap-3">
                        <Stat value={String(Math.round(countTotal))} label="Total opportunities" />
                        <Stat value={usd(Math.round(countValue))} label="Total value" />
                        <Stat value={String(Math.round(countWon))} label="Final / won" />
                      </div>
                      <div className="flex gap-2">
                        <SelectBox value="All stages" className="w-[180px]" />
                        <SelectBox value="Newest first" className="w-[180px]" />
                      </div>
                    </div>
                  </div>
                  <div className="ll-sales-pipeline-lanes">
                    {SALES_STAGES.map((s) => {
                      const cards = opps.filter((o) => o.stage === s.id);
                      return (
                        <div key={s.id} className="ll-sales-pipeline-lane rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                          <div className="mb-3">
                            <h2 className="truncate text-sm font-semibold text-slate-900">{s.name}</h2>
                            <p className="text-xs text-slate-500">{cards.length} {cards.length === 1 ? "opportunity" : "opportunities"}</p>
                          </div>
                          <div className="space-y-3">
                            <AnimatePresence initial={false}>
                              {cards.map((o) => (
                                <OppCard key={o.id} o={o} isNew={o.id === SALES_NEW_OPP.id} lifting={o.id === SALES_DRAG_ID && step === 7} reduced={reduced} />
                              ))}
                            </AnimatePresence>
                            <span className="flex h-8 items-center justify-center rounded-md text-xs font-medium text-slate-500"><Plus className="mr-1 h-3.5 w-3.5" />Add opportunity</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                </ClientShell>
              </m.div>
            </div>
          </MockWindow>
        </ScaleToFit>
      </div>
    </LazyMotion>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-2xl font-bold tracking-tight text-[#0A2B4A]">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{label}</p>
    </div>
  );
}

function OppCard({ o, isNew, lifting, reduced }: { o: SalesOpportunity; isNew: boolean; lifting: boolean; reduced: boolean }) {
  const stageName = SALES_STAGES.find((s) => s.id === o.stage)?.name ?? "";
  return (
    <m.div
      layout={!reduced}
      layoutId={reduced ? undefined : `opp-${o.id}`}
      initial={reduced ? false : isNew ? { opacity: 0, y: -10 } : false}
      animate={{ opacity: 1, y: 0, scale: lifting ? 1.03 : 1, rotate: lifting ? -1.5 : 0 }}
      exit={{ opacity: 0 }}
      transition={T_LAYOUT}
      className={`relative rounded-lg border bg-white p-3 shadow-sm ${lifting ? "z-10 border-[#4A90E2] shadow-lg" : isNew ? "border-[#4A90E2]/60" : "border-slate-200"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-snug text-slate-900">{o.title}</h3>
          <p className="mt-1 text-sm text-slate-700">{o.contact}</p>
          <p className="break-all text-xs text-slate-500">{o.email}</p>
        </div>
        <GripVertical className="h-4 w-4 shrink-0 text-slate-400" />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-sm font-semibold text-[#0A2B4A]">{usd(o.value)}</span>
        <span className="text-xs text-slate-500">{o.updated}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="flex h-8 flex-1 items-center justify-between rounded-md border border-[hsl(220_13%_91%)] bg-white px-2 text-xs text-slate-700">{stageName}<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 opacity-50" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg></span>
        <span className="p-1 text-slate-400"><Trash2 className="h-4 w-4" /></span>
      </div>
    </m.div>
  );
}

function NewOppDialog({ step, reduced }: { step: number; reduced: boolean }) {
  const title = useStreamText(SALES_NEW_OPP.title, step >= 4, { msPerToken: 55, reduced }).text;
  return (
    <m.div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <m.div className="relative w-[640px] rounded-lg border border-[hsl(220_13%_91%)] bg-white p-6 shadow-lg" initial={reduced ? false : { scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={T_ENTER}>
        <span className="absolute right-4 top-4 text-slate-400"><X className="h-4 w-4" /></span>
        <h2 className="text-lg font-semibold text-slate-900">New Opportunity</h2>
        <p className="mt-1 text-sm text-slate-500">Add a CRM contact to your sales pipeline.</p>
        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-900">Contact</p>
            <div className="mb-2 flex h-10 items-center gap-2 rounded-md border border-[hsl(220_13%_91%)] px-3 text-sm text-slate-400"><Search className="h-4 w-4" />{step >= 3 ? <span className="text-slate-900">Grace</span> : "Search contacts…"}</div>
            <SelectBox value={step >= 3 ? `${SALES_NEW_OPP.contact} — ${SALES_NEW_OPP.email}` : "Choose a contact"} active={step === 3} />
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-900">Title</p>
            <div className={`flex h-10 items-center rounded-md border px-3 text-sm ${step === 4 ? "border-[#4A90E2] ring-2 ring-[#4A90E2]/20" : "border-[hsl(220_13%_91%)]"}`}>
              {title ? <span className="text-slate-900">{title}</span> : <span className="text-slate-400">e.g. Enterprise renewal</span>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-900">Initial stage</p>
              <SelectBox value={SALES_STAGES[0].name} />
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-900">Value</p>
              <div className={`flex h-10 items-center rounded-md border px-3 text-sm ${step === 5 ? "border-[#4A90E2] ring-2 ring-[#4A90E2]/20" : "border-[hsl(220_13%_91%)]"}`}>
                {step >= 5 ? <span className="text-slate-900">{SALES_NEW_OPP.value}</span> : <span className="text-slate-400">Optional</span>}
              </div>
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-900">Notes</p>
            <div className="h-16 rounded-md border border-[hsl(220_13%_91%)] px-3 py-2 text-sm text-slate-400">Add context for your team…</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="outline">Cancel</Btn>
          <Btn className={step >= 5 ? "ring-2 ring-[#4A90E2]/30" : ""}>Create opportunity</Btn>
        </div>
      </m.div>
    </m.div>
  );
}
