import type { ReactNode } from "react";
import { AnimatePresence, LazyMotion, domMax, m } from "framer-motion";
import { Building, DollarSign, Download, Filter, PieChart, Send, Target, TrendingUp, Users } from "lucide-react";
import { BRAND_NAME } from "@/config/brand";
import { MockWindow, ScaleToFit } from "./MockWindow";
import { Btn, PageHeader } from "./ui-replicas";
import { ClientShell } from "./DealDashboardParts";
import { DEMO_ANALYTICS } from "./demo-data";
import { T_ENTER, useCountUp, useDemoTimeline } from "./useDemoTimeline";

/*
 * The investment group's own analytics: pages/developer-analytics.tsx
 * ("Analytics Dashboard", /developer/analytics, also routed at /outreach-analytics).
 * Clients do not get open/reply-rate outreach analytics; their outreach metric is the
 * "Outreach Sent · Messages sent" card. (The real page shows that card lower down,
 * below the Advanced Analytics section; it is placed beside the status chart here to fit.)
 * Steps: 1 KPI cards count up · 2 status donut draws · 3 Messages sent counts up
 *        4 Brokers tab -> Broker Performance Analytics
 */
const CUES = [500, 1500, 2400, 6000, 10500];

const ARIA = `Animated preview of an investment company's ${BRAND_NAME} Analytics Dashboard: deal totals, pipeline value, average deal size and conversion rate count up, the deal status chart fills in, the outreach messages-sent count rises, and the Brokers tab shows deal flow by broker.`;

const CARD = "rounded-2xl border border-slate-200 bg-white shadow-sm";
const STATUS_COLORS = { Passed: "#ef4444", Review: "#f59e0b", Pursuing: "#22c55e" } as const;

export default function OutreachAnalyticsDemo() {
  const tl = useDemoTimeline<HTMLDivElement>({ cues: CUES, totalMs: 12000, mobileCues: CUES, mobileTotalMs: 12000 });
  const { step, reduced, loopKey } = tl;
  const a = DEMO_ANALYTICS;
  const kpi = step >= 1;
  const deals = useCountUp(a.totalDeals, kpi, { duration: 1000, reduced });
  const value = useCountUp(a.pipelineValueM * 10, kpi, { duration: 1000, reduced });
  const avg = useCountUp(a.avgDealM * 10, kpi, { duration: 1000, reduced });
  const conv = useCountUp(a.conversion * 10, kpi, { duration: 1000, reduced });
  const sent = useCountUp(a.messagesSent, step >= 3, { duration: 1200, reduced });
  const tab = step >= 4 ? "Brokers" : "Overview";

  return (
    <LazyMotion features={domMax} strict>
      <div ref={tl.ref} className="ll-demo relative w-full" data-testid="demo-outreach-analytics">
        <ScaleToFit>
          <MockWindow path="/developer/analytics" paused={tl.paused} onTogglePause={reduced ? undefined : tl.togglePause}>
            <div role="img" aria-label={ARIA}>
              <m.div key={loopKey} className="ll-analytics-page" aria-hidden="true" initial={reduced || loopKey === 0 ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <ClientShell active="Analytics" expanded>
                  <PageHeader
                    compact
                    title="Analytics Dashboard"
                    actions={
                      <>
                        <Btn variant="outline"><Filter className="mr-2 h-4 w-4" />Filters</Btn>
                        <Btn variant="outline"><Download className="mr-2 h-4 w-4" />Export</Btn>
                      </>
                    }
                  />
                  <div className="mb-4 grid grid-cols-4 gap-3">
                    <Kpi label="Total Deals" value={String(Math.round(deals))} help="Based on filtered data" icon={<Building className="h-5 w-5" />} />
                    <Kpi label="Total Pipeline Value" value={`$${(value / 10).toFixed(1)}M`} help="Based on filtered data" icon={<DollarSign className="h-5 w-5" />} />
                    <Kpi label="Avg Deal Size" value={`$${(avg / 10).toFixed(1)}M`} help="Based on filtered data" icon={<Target className="h-5 w-5" />} />
                    <Kpi label="Conversion Rate" value={`${(conv / 10).toFixed(1)}%`} help="Pursuing / total deals" icon={<TrendingUp className="h-5 w-5" />} />
                  </div>
                  <div className="mb-4 grid h-10 grid-cols-4 items-center rounded-md bg-[hsl(210_20%_94%)] p-1 text-sm font-medium text-slate-500">
                    {["Overview", "Markets", "Brokers", "Trends"].map((t) => (
                      <span key={t} className={`flex h-8 items-center justify-center rounded-sm transition-colors duration-300 ${t === tab ? "bg-white text-[#081729] shadow-sm" : ""}`}>{t}</span>
                    ))}
                  </div>
                  <AnimatePresence initial={false} mode="wait">
                    {tab === "Overview" ? (
                      <m.div key="ov" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="ll-analytics-overview grid grid-cols-2 gap-3">
                        <div className={CARD}>
                          <CardTitle icon={<PieChart className="h-5 w-5 text-[#3286C8]" />}>Deal Status Distribution</CardTitle>
                          <div className="px-5 pb-4">
                            <Donut on={step >= 2} reduced={reduced} />
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              {(Object.keys(STATUS_COLORS) as (keyof typeof STATUS_COLORS)[]).map((k) => {
                                const n = a.status[k.toLowerCase() as "passed" | "review" | "pursuing"];
                                return (
                                  <div key={k} className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2">
                                    <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[k] }} /><span className="text-xs font-medium text-slate-600">{k}</span></div>
                                    <div className="mt-1 flex items-baseline justify-between"><span className="text-sm font-bold text-[#081729]">{step >= 2 ? n : 0}</span><span className="text-xs text-slate-400">{step >= 2 ? ((n / a.totalDeals) * 100).toFixed(1) : "0.0"}%</span></div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div className={CARD}>
                          <CardTitle icon={<Send className="h-5 w-5 text-[#3286C8]" />}>Outreach Sent</CardTitle>
                          <div className="px-5 pb-5">
                            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                              <div className="flex items-end justify-between"><div><p className="text-sm text-slate-500">Messages sent</p><p className="mt-1 text-2xl font-bold tabular-nums text-[#081729]">{Math.round(sent).toLocaleString("en-US")}</p></div><span className="text-xs font-semibold text-emerald-700">+12.8% this month</span></div>
                              <div className="ll-analytics-bars" aria-label="Weekly outreach messages sent"><i style={{ height: "38%" }} /><i style={{ height: "54%" }} /><i style={{ height: "47%" }} /><i style={{ height: "72%" }} /><i style={{ height: "64%" }} /><i style={{ height: "88%" }} /><i style={{ height: "100%" }} /></div>
                              <div className="ll-analytics-bar-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
                              <div className="ll-analytics-outreach-row"><span>Delivered</span><b>1,247</b><span>Replies</span><b>186</b><span>Bounced</span><b>37</b></div>
                            </div>
                          </div>
                        </div>
                        <div className={CARD}>
                          <CardTitle icon={<Building className="h-5 w-5 text-[#3286C8]" />}>Markets</CardTitle>
                          <div className="ll-analytics-market-list">
                            {[["Raleigh-Durham, NC", "38 deals", "82%"], ["Atlanta, GA", "31 deals", "68%"], ["Charlotte, NC", "24 deals", "54%"], ["Nashville, TN", "19 deals", "43%"]].map(([market, count, share]) => (
                              <div key={market}><span><b>{market}</b><small>{count}</small></span><i><em style={{ width: share }} /></i><strong>{share}</strong></div>
                            ))}
                          </div>
                        </div>
                        <div className={CARD}>
                          <CardTitle icon={<Users className="h-5 w-5 text-[#3286C8]" />}>Broker leaderboard</CardTitle>
                          <div className="ll-analytics-leaderboard">
                            {a.brokers.slice(0, 4).map((broker, index) => (
                              <div key={broker.name}><span className="ll-analytics-rank">{index + 1}</span><b>{broker.name}</b><span>{broker.deals} deals</span><strong>{broker.value}</strong></div>
                            ))}
                          </div>
                        </div>
                      </m.div>
                    ) : (
                      <m.div key="br" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={T_ENTER} className={CARD}>
                        <CardTitle icon={<Users className="h-5 w-5 text-[#3286C8]" />}>Broker Performance Analytics</CardTitle>
                        <div className="px-5 pb-4">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-200">
                                {["Broker", "Deals", "Total Value", "Avg Deal Size"].map((h) => <th key={h} className="px-4 py-2.5 text-left font-medium text-slate-500">{h}</th>)}
                              </tr>
                            </thead>
                            <tbody>
                              {a.brokers.map((b, i) => (
                                <m.tr key={b.name} initial={reduced ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...T_ENTER, delay: reduced ? 0 : 0.1 + i * 0.12 }} className="border-b border-slate-100">
                                  <td className="px-4 py-2.5 font-medium text-slate-800">{b.name}</td>
                                  <td className="px-4 py-2.5"><span className="inline-flex rounded-full border border-[hsl(220_13%_91%)] px-2.5 py-0.5 text-xs font-semibold">{b.deals}</span></td>
                                  <td className="px-4 py-2.5 font-semibold text-[#081729]">{b.value}</td>
                                  <td className="px-4 py-2.5 text-slate-700">{b.avg}</td>
                                </m.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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

function CardTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <p className="flex items-center gap-2 p-5 pb-3 text-lg font-semibold leading-none tracking-tight text-[#081729]">{icon}{children}</p>;
}

function Kpi({ label, value, help, icon }: { label: string; value: string; help: string; icon: ReactNode }) {
  return (
    <div className={`${CARD} overflow-hidden p-4`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1.5 whitespace-nowrap text-[22px] font-bold tabular-nums tracking-tight text-[#081729]">{value}</p>
          <p className="mt-0.5 text-xs text-slate-400">{help}</p>
        </div>
        <div className="rounded-xl bg-[#3286C8]/15 p-2.5 text-[#3286C8]">{icon}</div>
      </div>
    </div>
  );
}

/** recharts Pie, innerRadius 62 / outerRadius 88, paddingAngle 3, white stroke. */
function Donut({ on, reduced }: { on: boolean; reduced: boolean }) {
  const { passed, review, pursuing } = DEMO_ANALYTICS.status;
  const total = passed + review + pursuing;
  const r = 75;
  const C = 2 * Math.PI * r;
  const segs = [
    { v: passed, c: STATUS_COLORS.Passed },
    { v: review, c: STATUS_COLORS.Review },
    { v: pursuing, c: STATUS_COLORS.Pursuing },
  ];
  let acc = 0;
  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-[150px] w-[150px] -rotate-90">
      <circle cx="100" cy="100" r={r} fill="none" stroke="#f1f5f9" strokeWidth="26" />
      {segs.map((s, i) => {
        const len = (s.v / total) * C - 3;
        const off = acc;
        acc += (s.v / total) * C;
        return (
          <m.circle
            key={i}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={s.c}
            strokeWidth="26"
            strokeDasharray={`${len} ${C}`}
            initial={false}
            animate={{ strokeDashoffset: on ? -off : -off + len, opacity: on ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : i * 0.25, ease: [0.4, 0, 0.2, 1] }}
          />
        );
      })}
    </svg>
  );
}
