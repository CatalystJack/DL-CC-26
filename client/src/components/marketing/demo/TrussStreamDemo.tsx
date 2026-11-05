import { AnimatePresence, LazyMotion, domMax, m } from "framer-motion";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { AI_ASSISTANT_NAME, BRAND_NAME } from "@/config/brand";
import { MockWindow, ScaleToFit } from "./MockWindow";
import { AnalystHeader, AnalystTable, AnalystToolbar, ClientShell } from "./DealDashboardParts";
import { useDemoDataset } from "./demo-dataset";
import { T_ENTER, useDemoTimeline, useStreamText } from "./useDemoTimeline";

/*
 * Live deal feed: the investment group's own Deal Dashboard (/developer/dashboard,
 * pages/analyst-dashboard.tsx) receiving new deals, then the real
 * Truss assistant panel (components/developer-assistant-chat.tsx) answering about them.
 * Steps: 1-3 new deals land at the top · 4 Truss opens · 5 question sent · 6 loader · 7 answer streams
 */
const CUES = [900, 2000, 3100, 4400, 5200, 5800, 6900];

const ARIA = `Animated preview of an investment company's own ${BRAND_NAME} Deal Dashboard: three new deals arrive live at the top of the list, then the ${AI_ASSISTANT_NAME} assistant is asked what came in today and answers with a summary of the new deals.`;

export default function TrussStreamDemo() {
  const tl = useDemoTimeline<HTMLDivElement>({ cues: CUES, totalMs: 15000, mobileCues: CUES, mobileTotalMs: 15000 });
  const { step, reduced, loopKey } = tl;
  const { feedNew: DEMO_FEED_NEW, feedBase: DEMO_FEED_BASE, truss: DEMO_TRUSS } = useDemoDataset();
  const arrived = DEMO_FEED_NEW.slice(0, Math.min(step, 3)).reverse();
  const rows = [...arrived, ...DEMO_FEED_BASE, ...DEMO_FEED_NEW, ...DEMO_FEED_BASE].slice(0, 7);
  const newIds = arrived.map((r) => r.id);
  const answer = useStreamText(DEMO_TRUSS.answer, step >= 7, { msPerToken: 45, reduced });

  return (
    <LazyMotion features={domMax} strict>
      <div ref={tl.ref} className="ll-demo relative w-full" data-testid="demo-truss-stream">
        <ScaleToFit>
          <MockWindow path="/developer/dashboard" paused={tl.paused} onTogglePause={reduced ? undefined : tl.togglePause}>
            <div role="img" aria-label={ARIA}>
              <m.div key={loopKey} aria-hidden="true" initial={reduced || loopKey === 0 ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <ClientShell
                  active="Deal Dashboard"
                  expanded
                  overlay={
                    <>
                {/* Truss: fixed bottom-right in the app */}
                <div className="absolute bottom-4 right-4 z-40 flex flex-col items-end">
                  <AnimatePresence>
                    {step >= 4 && (
                      <m.section
                        key="panel"
                        initial={reduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={T_ENTER}
                        className="mb-3 flex h-[27rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                      >
                        <header className="flex items-center justify-between bg-[#081729] px-4 py-3 text-white">
                          <div>
                            <h2 className="text-sm font-semibold">{AI_ASSISTANT_NAME}</h2>
                            <p className="mt-0.5 text-xs text-slate-300">Your multifamily development copilot</p>
                          </div>
                          <span className="rounded-md p-1.5 text-slate-300"><X className="h-4 w-4" /></span>
                        </header>
                        <div className="flex-1 space-y-3 overflow-hidden bg-slate-50 p-3">
                          {step < 5 && (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                              Ask about your deals, pipeline, contacts, comparable properties, or acquisition criteria.
                            </div>
                          )}
                          {step >= 5 && (
                            <m.div initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                              <div className="max-w-[88%] rounded-2xl rounded-br-md bg-[#0A2B4A] px-3 py-2 text-sm leading-relaxed text-white">{DEMO_TRUSS.question}</div>
                            </m.div>
                          )}
                          {step === 6 && (
                            <div className="flex items-center gap-2 text-xs text-slate-500"><Loader2 className="h-3.5 w-3.5 animate-spin" />Checking your company data…</div>
                          )}
                          {step >= 7 && (
                            <div className="flex justify-start">
                              <div className="max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-700">
                                {answer.text}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-end gap-2 border-t border-slate-200 bg-white p-3">
                          <div className="flex min-h-10 flex-1 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-400">
                            {step === 4 ? <span className="text-slate-800">{DEMO_TRUSS.question}</span> : "Ask a question…"}
                          </div>
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0A2B4A] text-white"><Send className="h-4 w-4" /></span>
                        </div>
                      </m.section>
                    )}
                  </AnimatePresence>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0A2B4A] text-white shadow-xl ring-1 ring-white/20">
                    {step >= 4 ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
                  </span>
                </div>
                    </>
                  }
                >
                  <AnalystHeader />
                  <AnalystToolbar reduced={reduced} />
                  <AnalystTable rows={rows} reduced={reduced} highlightIds={newIds} hideCols={["name", "broker"]} footer={false} />
                </ClientShell>
              </m.div>
            </div>
          </MockWindow>
        </ScaleToFit>
      </div>
    </LazyMotion>
  );
}
