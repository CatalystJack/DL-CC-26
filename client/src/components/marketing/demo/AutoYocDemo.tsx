import { LazyMotion, domMax, m } from "framer-motion";
import { CheckCircle2, CircleDot, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { MockWindow, ScaleToFit } from "./MockWindow";
import { ClientShell } from "./DealDashboardParts";
import { useDemoTimeline, useStreamText } from "./useDemoTimeline";
import "./developer-screens.css";

const CUES = [700, 1800, 3000, 4200, 5500, 6900];
const MONEY = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Field({ label, value, active, reduced }: { label: string; value: string; active: boolean; reduced: boolean }) {
  const typed = useStreamText(value, active, { msPerToken: 22, reduced }).text;
  return (
    <div className="ll-screen-field">
      <span>{label}</span>
      <m.b initial={false} animate={{ color: active ? "#173c56" : "#9aa9b4" }}>{active ? typed : "—"}</m.b>
    </div>
  );
}

function Group({ title, active, children }: { title: string; active: boolean; children: ReactNode }) {
  return (
    <section className={`ll-screen-group ${active ? "is-filled" : ""}`}>
      <h4><span>{title}</span><i>{active ? <CheckCircle2 /> : <CircleDot />}</i></h4>
      <div className="ll-screen-fields">{children}</div>
    </section>
  );
}

export default function AutoYocDemo() {
  const tl = useDemoTimeline<HTMLDivElement>({ cues: CUES, totalMs: 8900, mobileCues: CUES, mobileTotalMs: 8900 });
  const { step, reduced } = tl;
  const annualScheduledRent = 90 * 1400 * 12 + 165 * 1650 * 12 + 45 * 2050 * 12;
  const annualOtherIncome = 300 * 225;
  const effectiveGrossIncome = (annualScheduledRent + annualOtherIncome) * 0.95;
  const managementCosts = effectiveGrossIncome * 0.03;
  const netOperatingIncome = effectiveGrossIncome - 300 * 5500 - managementCosts;
  const totalDevelopmentCost = 6_000_000 + 44_400_000 + 6_660_000 + 2_220_000;
  const yieldOnCost = (netOperatingIncome / totalDevelopmentCost) * 100;
  const trendedYieldOnCost = yieldOnCost * 1.03;
  const sensitivityRates = [0, 3, 5];
  const sensitivityRows = [
    { label: "Base rents", value: yieldOnCost },
    { label: "+3% rents", value: trendedYieldOnCost },
  ];
  const maximumLandBid = netOperatingIncome / 0.0625 - (totalDevelopmentCost - 6_000_000);
  const costActive = step >= 1;
  const opsActive = step >= 2;
  const mixActive = step >= 3;
  const exitActive = step >= 4;
  const resultsActive = step >= 5;

  return (
    <LazyMotion features={domMax} strict>
      <div ref={tl.ref} className="ll-demo ll-developer-screen ll-auto-yoc-screen" aria-label="Animated Auto YOC underwriting preview">
        <ScaleToFit>
          <MockWindow path="/developer/dashboard" paused={tl.paused} onTogglePause={reduced ? undefined : tl.togglePause}>
            <ClientShell active="Deal Dashboard" expanded>
              <div className="ll-screen-content">
                <header className="ll-screen-pagehead">
                  <div><small>UNDERWRITING · GARDEN MULTIFAMILY</small><h2>Yield on cost</h2><p>2215 Creedmoor Rd · Raleigh, NC · 14.2 ac</p></div>
                  <span className="ll-screen-status">Draft model</span>
                </header>
                <div className="ll-yoc-layout">
                  <div className="ll-yoc-groups">
                    <Group title="Product-specific costs" active={costActive}>
                      <Field label="Land price" value="$6,000,000" active={costActive} reduced={reduced} />
                      <Field label="Hard cost / unit" value="$148,000" active={costActive} reduced={reduced} />
                      <Field label="Hard cost / SF" value="$155" active={costActive} reduced={reduced} />
                      <Field label="Soft costs" value="15%" active={costActive} reduced={reduced} />
                      <Field label="Contingency" value="5%" active={costActive} reduced={reduced} />
                    </Group>
                    <Group title="Operating assumptions" active={opsActive}>
                      <Field label="Average rent" value="$1,634 / mo" active={opsActive} reduced={reduced} />
                      <Field label="Other income" value="$225 / unit / yr" active={opsActive} reduced={reduced} />
                      <Field label="Vacancy" value="5%" active={opsActive} reduced={reduced} />
                      <Field label="Operating expense" value="$5,500 / unit / yr" active={opsActive} reduced={reduced} />
                      <Field label="Management fee" value="3%" active={opsActive} reduced={reduced} />
                    </Group>
                    <Group title="Unit mix · 300 homes" active={mixActive}>
                      <div className="ll-yoc-mix-table">
                        <div><span>PLAN</span><span>UNITS</span><span>AVG SF</span><span>RENT / MO</span></div>
                        <div><b>1 BR / 1 BA</b><span><Field label="" value="90" active={mixActive} reduced={reduced} /></span><span>760</span><span>$1,400</span></div>
                        <div><b>2 BR / 2 BA</b><span><Field label="" value="165" active={mixActive} reduced={reduced} /></span><span>1,050</span><span>$1,650</span></div>
                        <div><b>3 BR / 2 BA</b><span><Field label="" value="45" active={mixActive} reduced={reduced} /></span><span>1,200</span><span>$2,050</span></div>
                        <div className="is-total"><b>Total / weighted</b><span>300</span><span>955</span><span>$1,634</span></div>
                      </div>
                    </Group>
                    <Group title="Exit inputs" active={exitActive}>
                      <Field label="Exit cap rate" value="5.25%" active={exitActive} reduced={reduced} />
                      <Field label="Hold period" value="5 years" active={exitActive} reduced={reduced} />
                      <Field label="Annual rent growth" value="3.0%" active={exitActive} reduced={reduced} />
                    </Group>
                  </div>
                  <m.aside className={`ll-yoc-results ${resultsActive ? "is-ready" : ""}`} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                      <div className="ll-yoc-results-head"><span><TrendingUp /> MODEL RESULTS</span><b>PASS</b></div>
                      <strong className="ll-yoc-primary-result">{yieldOnCost.toFixed(2)}%<small>YIELD ON COST</small></strong>
                      <div className="ll-yoc-target">Target YOC 6.25% <b>· PASS</b></div>
                      <div className="ll-yoc-result-line"><span>Total development cost</span><b>{MONEY.format(totalDevelopmentCost)}</b></div>
                      <div className="ll-yoc-result-line"><span>Stabilized NOI</span><b>{MONEY.format(netOperatingIncome)}</b></div>
                      <div className="ll-yoc-result-line"><span>Untrended YOC</span><b>{yieldOnCost.toFixed(2)}%</b></div>
                      <div className="ll-yoc-result-line"><span>Trended YOC · Year 2</span><b>{trendedYieldOnCost.toFixed(2)}%</b></div>
                      <div className="ll-yoc-result-line"><span>Levered IRR</span><b>14.8%</b></div>
                      <div className="ll-yoc-result-line"><span>Unlevered IRR</span><b>10.3%</b></div>
                      <div className="ll-yoc-result-line"><span>Max land bid</span><b>{MONEY.format(maximumLandBid)}</b></div>
                      <div className="ll-yoc-sensitivity">
                        <b>YOC sensitivity</b>
                        <div><span>Rent growth</span>{sensitivityRates.map((rate) => <span key={rate}>{rate}%</span>)}</div>
                        {sensitivityRows.map(({ label, value }) => (
                          <div key={label}><span>{label}</span>{sensitivityRates.map((rate) => <b key={rate}>{(value * (1 + rate / 100)).toFixed(2)}%</b>)}</div>
                        ))}
                      </div>
                      <small className="ll-yoc-result-foot">Year-one NOI {MONEY.format(netOperatingIncome)} · total cost {MONEY.format(totalDevelopmentCost)}</small>
                  </m.aside>
                </div>
              </div>
            </ClientShell>
          </MockWindow>
        </ScaleToFit>
      </div>
    </LazyMotion>
  );
}
