import { AnimatePresence, LazyMotion, domMax, m } from "framer-motion";
import type { ReactNode } from "react";
import { Check, CheckCircle2, Forward, Mail, Paperclip, Send, TrendingUp } from "lucide-react";
import { BRAND_NAME } from "@/config/brand";
import { MockWindow, ScaleToFit } from "./MockWindow";
import { AnalystHeader, AnalystTable, AnalystToolbar, ClientShell } from "./DealDashboardParts";
import type { DealStatus, DemoDeal } from "./demo-data";
import { money } from "./demo-data";
import { useDemoDataset } from "./demo-dataset";
import { T_ENTER, useDemoTimeline, useStreamText } from "./useDemoTimeline";

/*
 * Hero story (investment-company / client view):
 *   1 Forwarded OM lands in the deals inbox
 *   2 Intake card opens; address / acres / ask / type auto-fill
 *   3 Acquisition-criteria checks clear (market, acres, rent)
 *   4 Yield on cost passes the group's target
 *   5 New row #1042 inserts as "?", flips to Review, then Pursuing (priority 1)
 *   6 Outreach queued toast · settle · loop
 * Desktop ~14.5s. Mobile skips the full underwriting panel and keeps the toast.
 */
const CUES = [700, 2200, 4200, 6200, 7800, 9800, 13200];
const MOBILE_CUES = [500, 1800, 3400, 5000, 6400, 8200, 11200];

const ARIA = `Animated preview of an investment company's ${BRAND_NAME} Deal Dashboard: a broker offering memorandum is forwarded by email, DealLinq auto-fills the deal and checks it against the group's acquisition criteria and yield on cost target, the deal lands on the dashboard as Pursuing, and broker outreach is queued.`;

export default function IntakeToPipelineDemo() {
  const tl = useDemoTimeline<HTMLDivElement>({
    cues: CUES,
    totalMs: 14500,
    mobileCues: MOBILE_CUES,
    mobileTotalMs: 12500,
  });
  const { step, reduced, isMobile, loopKey } = tl;
  const { newDeal: DEMO_NEW_DEAL, deals: DEMO_DEALS } = useDemoDataset();

  const status: DealStatus =
    step >= 5 ? "pursuing" : step >= 4 ? "reviewing" : step >= 3 ? "unclassified" : "unclassified";
  const priority = step >= 5 ? 1 : undefined;
  const showRow = step >= 3;
  const newRow: DemoDeal = { ...DEMO_NEW_DEAL, status: showRow ? status : "unclassified", priority };
  // Brief "?" unclassified beat right as the row lands (step 3), then reviewing at step 4, pursuing at 5.
  if (step === 3) newRow.status = "unclassified";
  if (step === 4) newRow.status = "reviewing";
  if (step >= 5) {
    newRow.status = "pursuing";
    newRow.priority = 1;
  }

  const rows = showRow ? [newRow, ...DEMO_DEALS.slice(0, 6)] : DEMO_DEALS.slice(0, 6);
  const highlight = showRow && step < 6 ? [DEMO_NEW_DEAL.id] : [];
  const showEmail = step === 1;
  const showIntake = step === 2 || (step === 3 && !isMobile);
  const showOutreach = step >= 6;

  return (
    <LazyMotion features={domMax} strict>
      <div ref={tl.ref} className="ll-demo relative w-full" data-testid="demo-intake-pipeline">
        <ScaleToFit>
          <MockWindow path="/developer/dashboard" paused={tl.paused} onTogglePause={reduced ? undefined : tl.togglePause}>
            <div role="img" aria-label={ARIA}>
              <m.div
                key={loopKey}
                aria-hidden="true"
                initial={reduced || loopKey === 0 ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <ClientShell
                  active="Deal Dashboard"
                  expanded
                  overlay={
                    <>
                      <AnimatePresence>
                        {showEmail && (
                          <m.div
                            key="fwd"
                            className="absolute right-6 top-5 z-30"
                            initial={reduced ? false : { opacity: 0, y: -24, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={
                              reduced
                                ? { opacity: 0 }
                                : { opacity: 0, y: 120, x: -140, scale: 0.55, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
                            }
                            transition={T_ENTER}
                          >
                            <EmailChip />
                          </m.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {showIntake && (
                          <m.div
                            key="intake"
                            className={`absolute z-30 ${isMobile ? "left-3 right-3 top-16" : "left-1/2 top-14 w-[560px] -translate-x-1/2"}`}
                            initial={reduced ? false : { opacity: 0, y: 18, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.35 } }}
                            transition={T_ENTER}
                          >
                            <IntakeCard step={step} reduced={reduced} compact={isMobile} />
                          </m.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {showOutreach && (
                          <m.div
                            key="outreach"
                            className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2"
                            initial={reduced ? false : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={T_ENTER}
                          >
                            <OutreachToast />
                          </m.div>
                        )}
                      </AnimatePresence>
                    </>
                  }
                >
                  <AnalystHeader />
                  <AnalystToolbar reduced={reduced} />
                  <AnalystTable rows={rows} highlightIds={highlight} reduced={reduced} hideCols={["name", "broker"]} />
                </ClientShell>
              </m.div>
            </div>
          </MockWindow>
        </ScaleToFit>
      </div>
    </LazyMotion>
  );
}

function EmailChip() {
  const { broker, email } = useDemoDataset();
  return (
    <div className="w-[330px] rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xl ring-1 ring-black/5">
      <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Forward className="h-3.5 w-3.5 text-[#3286C8]" />
          Forwarded to your deals inbox
        </span>
        <span>now</span>
      </div>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3286C8]/15 text-[#3286C8]">
          <Mail className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#081729]">{email.subject.replace(/\u2013|\u2014/g, "-")}</p>
          <p className="truncate text-xs text-slate-500">Originally from {broker.email}</p>
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
            <Paperclip className="h-3 w-3" />
            {email.attachment}
          </p>
        </div>
      </div>
    </div>
  );
}

function IntakeCard({ step, reduced, compact }: { step: number; reduced: boolean; compact: boolean }) {
  const { newDeal, criteria } = useDemoDataset();
  const fill = step >= 2;
  const checks = step >= 3;
  const yoc = step >= 3 && !compact;

  const addr = useStreamText(`${newDeal.address}, ${newDeal.city}`, fill, { msPerToken: 18, reduced });
  const acres = useStreamText(String(newDeal.acres), fill, { msPerToken: 40, reduced });
  const ask = useStreamText(money(newDeal.price), fill, { msPerToken: 22, reduced });
  const type = useStreamText(newDeal.productTypes[0] ?? "Garden", fill, { msPerToken: 30, reduced });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-20px_rgba(10,43,74,0.45)] ring-1 ring-black/5">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#3286C8]">Deal intake · auto-filled from OM</p>
        <p className="mt-1 text-base font-semibold text-[#081729]">{newDeal.address}</p>
      </div>

      <div className={`grid gap-2 px-4 py-3 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
        <Field label="Address" value={addr.text || "—"} />
        <Field label="Acres" value={acres.text || "—"} />
        <Field label="Ask price" value={ask.text || "—"} />
        <Field label="Product type" value={type.text || "—"} />
      </div>

      <div className="flex flex-wrap gap-1.5 px-4 pb-3">
        <CheckTag show={checks} reduced={reduced}>{criteria.marketCheck.replace(/\u2013|\u2014/g, "-")}</CheckTag>
        <CheckTag show={checks} reduced={reduced}>{criteria.acreageCheck.replace(/\u2013|\u2014/g, "-")}</CheckTag>
        <CheckTag show={checks} reduced={reduced}>{criteria.rentCheck.replace(/\u2013|\u2014/g, "-")}</CheckTag>
      </div>

      {yoc && (
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-3 border-t border-slate-100 bg-slate-50/80 px-4 py-3">
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Underwriting</p>
            <Row k="Land price" v="$3,400,000" />
            <Row k="Hard cost / unit" v="$155,000" />
            <Row k="Avg rent" v="$1,638 / mo" />
            <Row k="Units" v="280" />
          </div>
          <m.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.15, ...T_ENTER }}
            className="rounded-xl bg-[#000914] p-3 text-white"
          >
            <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-[#55C3E9]" /> Yield on cost
              </span>
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">PASS</span>
            </div>
            <p className="font-[Outfit,Inter,sans-serif] text-2xl font-semibold leading-none">
              6.47%<span className="ml-1 text-[10px] font-medium tracking-[0.08em] text-slate-400">YOC</span>
            </p>
            <p className="mt-2 text-[11px] text-slate-300">Target YOC 6.25% · clears acquisition criteria</p>
          </m.div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-[12px] font-semibold text-[#081729]">{value}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span>{k}</span>
      <b className="font-semibold text-slate-800">{v}</b>
    </div>
  );
}

function CheckTag({ show, children, reduced }: { show: boolean; children: ReactNode; reduced: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <m.span
          initial={reduced ? false : { opacity: 0, y: 4, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={T_ENTER}
          className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800"
        >
          <Check className="h-3 w-3" strokeWidth={3} />
          {children}
        </m.span>
      )}
    </AnimatePresence>
  );
}

function OutreachToast() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-[#000914] px-4 py-2.5 text-[12px] text-white shadow-2xl ring-1 ring-white/10">
      <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-teal-300">
        <Send className="h-3 w-3" /> Outreach
      </span>
      <span>Queued in Southeast Broker Intro · 3 steps · Outlook connected</span>
      <CheckCircle2 className="ml-1 h-4 w-4 text-emerald-400" />
    </div>
  );
}
