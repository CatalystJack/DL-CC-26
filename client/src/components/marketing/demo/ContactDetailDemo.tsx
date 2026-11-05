import { useState } from "react";
import { LazyMotion, domMax, m } from "framer-motion";
import { ArrowLeft, Building2, Mail, MoreHorizontal, Pencil, Save } from "lucide-react";
import { MockWindow, ScaleToFit } from "./MockWindow";
import { ClientShell } from "./DealDashboardParts";
import { useDemoTimeline } from "./useDemoTimeline";
import "./developer-screens.css";

const CUES = [750, 1700, 2600, 3800, 5400];
const ACTIVITIES = [
  { icon: "↩", title: "Reply received from Marcus", detail: "Re: Raleigh acquisition criteria · Connected inbox · Oct 26, 2026" },
  { icon: "✉", title: "Email opened", detail: "Subject: Raleigh acquisition criteria · Connected inbox · Oct 26, 2026" },
  { icon: "✉", title: "Email sent by Morgan Hayes", detail: "Subject: Charlotte land update · Connected inbox · Oct 24, 2026" },
  { icon: "☎", title: "Call completed", detail: "Discussed the Sardis Road survey timeline · Oct 23, 2026" },
  { icon: "↗", title: "Deal status changed", detail: "2215 Creedmoor Rd · Review → Pursuing · Oct 22, 2026" },
  { icon: "✎", title: "Team note added by Dana Price", detail: "Marcus prefers early notice on Triangle opportunities · Oct 21, 2026" },
  { icon: "✉", title: "Email opened", detail: "Subject: Off-market site on Sardis Road · Connected inbox · Oct 20, 2026" },
  { icon: "↗", title: "Deal status changed", detail: "4120 Sardis Rd · New → Review · Oct 19, 2026" },
  { icon: "✉", title: "Email sent by Morgan Hayes", detail: "Subject: Introduction and current acquisition focus · Connected inbox · Oct 16, 2026" },
];

export default function ContactDetailDemo() {
  const tl = useDemoTimeline<HTMLDivElement>({ cues: CUES, totalMs: 7400, mobileCues: CUES, mobileTotalMs: 7400 });
  const { step, reduced } = tl;
  const [activeTab, setActiveTab] = useState("Overview");
  const currentTab = activeTab;
  const activeActivity = Math.max(0, Math.min(step - 1, ACTIVITIES.length - 1));

  return (
    <LazyMotion features={domMax} strict>
      <div ref={tl.ref} className="ll-demo ll-developer-screen ll-contact-detail-screen" aria-label="Animated broker contact record preview">
        <ScaleToFit>
          <MockWindow path="/developer/crm/contacts" paused={tl.paused} onTogglePause={reduced ? undefined : tl.togglePause}>
            <ClientShell active="CRM" expanded>
              <div className="ll-screen-content">
                <a className="ll-contact-back" href="#demo"><ArrowLeft /> Back to contacts</a>
                <header className="ll-contact-record-head">
                  <i className="ll-record-avatar">MW</i>
                  <div className="ll-record-identity"><h2>Marcus Whitfield</h2><p>Senior Broker <span>·</span> Crescent Oak Realty</p></div>
                  <div className="ll-record-actions"><button><Mail /> Email</button><button><Pencil /> Edit</button><button className="is-primary"><Save /> Save Changes</button></div>
                </header>
                <div className="ll-contact-meta">
                  <span><small>PHONE</small><b>(704) 382-4417</b></span>
                  <span><small>EMAIL</small><b>m.whitfield@crescentoakrealty.com</b></span>
                  <span><small>COMPANY</small><b>Crescent Oak Realty</b></span>
                  <span><small>LAST CONTACTED</small><b>Oct 26, 2026</b></span>
                </div>
                <div className="ll-contact-detail-grid">
                  <aside className="ll-contact-record">
                    <small>RECORD</small><h3>Contact details</h3>
                    {[
                      ["Name", "Marcus Whitfield"], ["Email", "m.whitfield@crescentoakrealty.com"], ["Phone", "(704) 382-4417"],
                      ["Account / Company", "Crescent Oak Realty"], ["Assigned To", "Dana Price"], ["Contact Type", "Investment sales broker"],
                      ["Lead Source", "Charlotte broker network"], ["Last Contacted", "Oct 26, 2026"],
                    ].map(([label, value]) => <div className="ll-record-detail-row" key={label}><span>{label}</span><b>{value}</b></div>)}
                    <section className="ll-contact-record-section">
                      <h4>Tags</h4>
                      <div className="ll-contact-record-tags"><i>Broker</i><i>Multifamily</i><i>Land</i><i>North Carolina</i><i>Warm Lead</i></div>
                    </section>
                    <section className="ll-contact-record-section ll-contact-record-notes">
                      <h4>Team notes</h4>
                      <p>Prefers early notice on Raleigh and Charlotte garden opportunities. Follow up after the seller confirms the Sardis Road survey timeline.</p>
                      <small>Dana Price · Oct 21, 2026</small>
                    </section>
                  </aside>
                  <main className="ll-contact-main">
                    <nav className="ll-contact-tabs" aria-label="Contact sections">
                      {["Overview", "Activity", "Deals", "Notes"].map((tab) => <button type="button" onClick={() => setActiveTab(tab)} className={currentTab === tab ? "is-active" : ""} key={tab}>{tab}</button>)}
                    </nav>
                    {(currentTab === "Overview" || currentTab === "Activity") && (
                      <>
                        <div className="ll-contact-summary-cards"><span><small>RELATED DEALS</small><b>3</b></span><span><small>CAMPAIGNS</small><b>1 active</b></span><span><small>RELATIONSHIP</small><b>Warm</b></span></div>
                        <div className="ll-contact-overview-layout">
                          <section className="ll-contact-activity"><h3>Activity timeline <span>Recent first</span></h3>
                            {ACTIVITIES.map((item, index) => <m.article className={`ll-contact-activity-item ${activeActivity === index ? "is-current" : ""}`} key={`${item.title}-${index}`} initial={false} animate={{ opacity: 1, backgroundColor: activeActivity === index ? "#f4f9fc" : "#fff" }} transition={{ duration: reduced ? 0 : 0.3 }}><i>{item.icon}</i><span><b>{item.title}</b><small>{item.detail}</small></span></m.article>)}
                          </section>
                          <div className="ll-contact-context">
                            <section className="ll-contact-extra ll-contact-campaign-card">
                              <h3>Active campaign</h3>
                              <b>Southeast Broker Introduction</b>
                              <div><span>Enrollment</span><strong>Step 2 of 4</strong></div>
                              <div><span>Next send</span><strong>Oct 29, 2026</strong></div>
                              <small>Connected Outlook · Stops when Marcus replies</small>
                            </section>
                            <section className="ll-contact-extra ll-contact-deals-card">
                              <h3>Related deals <span>3</span></h3>
                              <div className="ll-contact-deal-row"><b>4120 Sardis Rd</b><span>Review</span></div>
                              <div className="ll-contact-deal-row"><b>2215 Creedmoor Rd</b><span>Pursuing</span></div>
                              <div className="ll-contact-deal-row"><b>Cedar Ridge Assemblage</b><span>Qualified</span></div>
                            </section>
                          </div>
                        </div>
                      </>
                    )}
                    {currentTab === "Deals" && <section className="ll-contact-related-deals"><h3>Related deals <span>3</span></h3><article><Building2 /><span><b>4120 Sardis Rd</b><small>Charlotte, NC · 9.6 ac · Garden Multifamily</small></span><strong>Review</strong></article><article><Building2 /><span><b>2215 Creedmoor Rd</b><small>Raleigh, NC · 14.2 ac · Garden Multifamily</small></span><strong>Pursuing</strong></article><article><Building2 /><span><b>Cedar Ridge Assemblage</b><small>Raleigh-Cary, NC · 18.4 ac · Garden Multifamily</small></span><strong>Qualified</strong></article></section>}
                    {currentTab === "Notes" && <section className="ll-contact-note"><h3>Team notes</h3><p>Marcus prefers early notice on Raleigh and Charlotte garden deals. Follow up after the seller confirms the Sardis Road survey timeline.</p><small>Added by Dana Price · Oct 26, 2026</small><MoreHorizontal /></section>}
                  </main>
                </div>
              </div>
            </ClientShell>
          </MockWindow>
        </ScaleToFit>
      </div>
    </LazyMotion>
  );
}
