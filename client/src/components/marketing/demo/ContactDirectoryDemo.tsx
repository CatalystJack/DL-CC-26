import { useMemo } from "react";
import { LazyMotion, domMax, m } from "framer-motion";
import { Filter, Plus, Search, Users } from "lucide-react";
import { MockWindow, ScaleToFit } from "./MockWindow";
import { ClientShell } from "./DealDashboardParts";
import { useDemoTimeline, useStreamText } from "./useDemoTimeline";
import "./developer-screens.css";

const CUES = [700, 2500, 4600, 6500];
const CONTACTS = [
  { name: "Marcus Whitfield", email: "m.whitfield@crescentoakrealty.com", phone: "(704) 382-4417", company: "Crescent Oak Realty", tags: ["Broker", "Multifamily", "Land"], owner: "Dana Price", deals: 8, added: "Oct 12", state: "NC" },
  { name: "Priya Shah", email: "priya@queen-citycre.com", phone: "(919) 221-2048", company: "Queen City Commercial", tags: ["Broker", "BTR", "Warm Lead"], owner: "Dana Price", deals: 5, added: "Oct 09", state: "NC" },
  { name: "Jordan Lee", email: "jordan@blueheronrealty.com", phone: "(919) 435-6183", company: "Blue Heron Realty", tags: ["Broker", "Land"], owner: "Morgan Hayes", deals: 4, added: "Oct 06", state: "NC" },
  { name: "Morgan Chen", email: "morgan@peachtreeadvisors.com", phone: "(404) 682-3197", company: "Peachtree Property Advisors", tags: ["Owner", "Land", "Atlanta"], owner: "Dana Price", deals: 3, added: "Oct 02", state: "GA" },
  { name: "Taylor Brooks", email: "taylor@palmettopropertyco.com", phone: "(843) 619-7382", company: "Palmetto Property Co.", tags: ["Owner", "Multifamily"], owner: "Chris Bell", deals: 6, added: "Sep 27", state: "SC" },
  { name: "Casey Park", email: "casey@lowcountrycre.com", phone: "(843) 619-7382", company: "Lowcountry Commercial", tags: ["Broker", "Coastal", "BTR"], owner: "Morgan Hayes", deals: 4, added: "Sep 24", state: "SC" },
  { name: "Sam Ortiz", email: "sam@northwindresidential.com", phone: "(919) 503-1846", company: "Northwind Residential", tags: ["Owner", "Multifamily"], owner: "Chris Bell", deals: 7, added: "Sep 18", state: "NC" },
  { name: "Riley Hart", email: "riley@oakviewland.com", phone: "(770) 314-6925", company: "Oakview Land Group", tags: ["Broker", "Land"], owner: "Dana Price", deals: 2, added: "Sep 12", state: "GA" },
  { name: "Elena Brooks", email: "elena@piedmontproperty.com", phone: "(919) 414-7328", company: "Piedmont Property Advisors", tags: ["Broker", "Multifamily"], owner: "Morgan Hayes", deals: 5, added: "Sep 08", state: "NC" },
  { name: "Caleb Turner", email: "caleb@riverstonecre.com", phone: "(704) 280-5174", company: "Riverstone Commercial", tags: ["Broker", "Land", "Warm Lead"], owner: "Dana Price", deals: 3, added: "Sep 03", state: "NC" },
  { name: "Nia Campbell", email: "nia@peachtreecapitalgroup.com", phone: "(404) 551-8902", company: "Peachtree Capital Group", tags: ["Owner", "Atlanta"], owner: "Chris Bell", deals: 2, added: "Aug 28", state: "GA" },
  { name: "Ethan Price", email: "ethan@lowcountryadvisors.com", phone: "(843) 620-4419", company: "Lowcountry Advisors", tags: ["Broker", "Coastal"], owner: "Morgan Hayes", deals: 4, added: "Aug 21", state: "SC" },
];

export default function ContactDirectoryDemo() {
  const tl = useDemoTimeline<HTMLDivElement>({ cues: CUES, totalMs: 8500, mobileCues: CUES, mobileTotalMs: 8500 });
  const { step, reduced } = tl;
  const typed = useStreamText("Marcus Whitfield", step === 1, { msPerToken: 120, reduced }).text;
  const rows = useMemo(() => {
    if (step === 1) return CONTACTS.filter((contact) => `${contact.name} ${contact.company}`.toLowerCase().includes(typed.toLowerCase()));
    if (step >= 2) return CONTACTS.filter((contact) => contact.tags.includes("Broker") || contact.tags.includes("Owner"));
    return CONTACTS;
  }, [step, typed]);
  const filtering = step >= 2;

  return (
    <LazyMotion features={domMax} strict>
      <div ref={tl.ref} className="ll-demo ll-developer-screen ll-contacts-screen" aria-label="Animated company contacts preview">
        <ScaleToFit>
          <MockWindow path="/developer/crm" paused={tl.paused} onTogglePause={reduced ? undefined : tl.togglePause}>
            <ClientShell active="CRM" expanded>
              <div className="ll-screen-content">
                <header className="ll-screen-pagehead ll-contacts-pagehead">
                  <div><small>RELATIONSHIP DIRECTORY</small><h2>Contacts</h2></div>
                  <strong>{filtering ? `${rows.length} contacts` : "784 total"}</strong>
                  <button type="button" className="ll-screen-button"><Plus /> New Contact</button>
                </header>
                <div className="ll-contacts-tools">
                  <label className="ll-contacts-search"><Search /><span>{typed || "Search name, email, phone..."}</span><i /></label>
                  {[filtering ? "Broker + Owner" : "All tags", "+ Tag", "All SMS", filtering ? "Southeast" : "All States", "All MSAs", "All Counties", "All Reps"].map((filter, index) => (
                    <span className={`ll-contacts-chip ${(filtering && (index === 0 || index === 1 || index === 3)) ? "is-selected" : ""}`} key={filter}>{index === 1 ? <Filter /> : null}{filter}</span>
                  ))}
                </div>
                <div className="ll-contacts-table-wrap">
                  <div className="ll-contacts-table">
                    <div className="ll-contacts-row ll-contacts-table-head"><span>Contact</span><span>Reach</span><span>Organization</span><span>Signals</span><span>Owner</span><span>Deals</span><span>Added</span></div>
                    {rows.map((contact) => {
                      const selected = step >= 3 && contact.name === "Marcus Whitfield";
                      return (
                        <m.div key={contact.name} className={`ll-contacts-row ${selected ? "is-highlighted" : ""}`} initial={false} animate={{ opacity: 1, backgroundColor: selected ? "#eaf5fb" : "#fff" }} transition={{ duration: 0.35 }}>
                          <span className="ll-contact-name"><i>{contact.name.split(" ").map((name) => name[0]).join("")}</i><b>{contact.name}<small>ACTIVE</small></b></span>
                          <span className="ll-contact-reach">{contact.email}<small>{contact.phone}</small></span>
                          <span>{contact.company}</span>
                          <span className="ll-contact-tags">{contact.tags.map((tag) => <i key={tag}>{tag}</i>)}</span>
                          <span>{contact.owner}</span><span>{contact.deals}</span><span>{contact.added}</span>
                        </m.div>
                      );
                    })}
                  </div>
                </div>
                <div className="ll-contacts-foot"><Users /> {filtering ? `${rows.length} matching broker and owner contacts` : `Showing ${CONTACTS.length} of 784 contacts`} <span>Updated just now</span></div>
              </div>
            </ClientShell>
          </MockWindow>
        </ScaleToFit>
      </div>
    </LazyMotion>
  );
}
