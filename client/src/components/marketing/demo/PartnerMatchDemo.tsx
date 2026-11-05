import { AnimatePresence, LazyMotion, domMax, m } from "framer-motion";
import { Check, ChevronDown, Plus, Save, Search, Upload, Users, UserCheck } from "lucide-react";
import { BRAND_NAME } from "@/config/brand";
import { MockWindow, ScaleToFit } from "./MockWindow";
import { PageHeader } from "./ui-replicas";
import { ClientShell } from "./DealDashboardParts";
import { DEMO_CONTACTS, type DemoContact } from "./demo-data";
import { T_ENTER, T_LAYOUT, useDemoTimeline } from "./useDemoTimeline";

/*
 * Matched brokers, investment-company (client) view only. Clients have no
 * "Development Partners" screen (that is admin-only); what they see is:
 *   pages/developer-criteria-settings.tsx  "Shared broker contacts" opt-in (/developer/settings)
 *   pages/developer-crm.tsx                "Company contacts" (/developer/crm), where shared-network
 *                                          brokers matching the group's sectors/states appear.
 * (Email/Phone/Tags columns omitted to fit the frame.)
 * Steps: 1 opt in · 2 sectors + states shown · 3 go to CRM (own contact only)
 *        4-7 matching shared brokers arrive (Source: DealLinq) · 8 State: TX filter
 */
const CUES = [600, 1300, 2200, 2650, 2900, 3150, 3400, 7000, 10400];

const ARIA = `Animated preview of an investment company's ${BRAND_NAME} Settings and CRM: the group opts in to shared broker contacts for its sectors and states, and matching brokers from the ${BRAND_NAME} network appear in its Company contacts list.`;

const OWN = DEMO_CONTACTS.filter((c) => c.source === "Your contact");
const MATCHED: DemoContact[] = [
  ...DEMO_CONTACTS.filter((c) => c.source === "DealLinq" && ["TX", "GA", "NC"].includes(c.state)),
  { name: "Elena Brooks", email: "elena@piedmontproperty.com", phone: "(919) 414-7328", brokerage: "Piedmont Property Advisors", region: "Wake County, NC", state: "NC", category: "Broker", sourceTags: ["Multifamily"], source: "DealLinq", color: "#3286c8" },
  { name: "Caleb Turner", email: "caleb@riverstonecre.com", phone: "(704) 280-5174", brokerage: "Riverstone Commercial", region: "Mecklenburg County, NC", state: "NC", category: "Broker", sourceTags: ["Land", "BTR"], source: "DealLinq", color: "#7c8fa3" },
  { name: "Nia Campbell", email: "nia@peachtreecapitalgroup.com", phone: "(404) 551-8902", brokerage: "Peachtree Capital Group", region: "Fulton County, GA", state: "GA", category: "Owner", sourceTags: ["Multifamily"], source: "DealLinq", color: "#22a06b" },
  { name: "Ethan Price", email: "ethan@lowcountryadvisors.com", phone: "(843) 620-4419", brokerage: "Lowcountry Advisors", region: "Charleston County, SC", state: "SC", category: "Broker", sourceTags: ["Coastal"], source: "DealLinq", color: "#f59e0b" },
  { name: "Avery Wilson", email: "avery@trianglelandco.com", phone: "(919) 404-6182", brokerage: "Triangle Land Company", region: "Durham County, NC", state: "NC", category: "Broker", sourceTags: ["Land"], source: "DealLinq", color: "#a855f7" },
  { name: "Darius Green", email: "darius@atlanticcregroup.com", phone: "(803) 619-3840", brokerage: "Atlantic Commercial Group", region: "Richland County, SC", state: "SC", category: "Owner", sourceTags: ["Multifamily"], source: "DealLinq", color: "#ef4444" },
];

export default function PartnerMatchDemo() {
  const tl = useDemoTimeline<HTMLDivElement>({ cues: CUES, totalMs: 12000, mobileCues: CUES, mobileTotalMs: 12000 });
  const { step, reduced, loopKey } = tl;
  const onCrm = step >= 3;
  const arrived = step >= 8 ? MATCHED : MATCHED.slice(0, Math.max(0, Math.min(step - 3, MATCHED.length)));
  let rows: DemoContact[] = [...arrived, ...OWN];
  const stateNc = step >= 8;
  if (stateNc) rows = rows.filter((r) => r.state === "NC");

  return (
    <LazyMotion features={domMax} strict>
      <div ref={tl.ref} className="ll-demo relative w-full" data-testid="demo-partner-match">
        <ScaleToFit>
          <MockWindow path={onCrm ? "/developer/crm" : "/developer/settings"} paused={tl.paused} onTogglePause={reduced ? undefined : tl.togglePause}>
            <div role="img" aria-label={ARIA}>
              <m.div key={loopKey} aria-hidden="true" initial={reduced || loopKey === 0 ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <ClientShell active={onCrm ? "CRM" : "Settings"} expanded bg={onCrm ? "bg-[#f3f6f9]" : "bg-slate-50"}>
                  <AnimatePresence initial={false} mode="wait">
                    {onCrm ? (
                      <m.div key="crm" className="h-full min-h-0" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                        <Crm rows={rows} total={OWN.length + arrived.length} stateNc={stateNc} newNames={arrived.map((a) => a.name)} reduced={reduced} />
                      </m.div>
                    ) : (
                      <m.div key="settings" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                        <SettingsCard step={step} reduced={reduced} />
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

/* ---------------- Settings: "Shared broker contacts" ---------------- */

function Multi({ label, values, show, reduced }: { label: string; values: string[]; show: boolean; reduced: boolean }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-slate-700">{label}</p>
      <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-[hsl(220_13%_91%)] bg-white px-2 py-1.5">
        {show ? (
          values.map((v, i) => (
            <m.span
              key={v}
              initial={reduced ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...T_ENTER, delay: reduced ? 0 : i * 0.08 }}
              className="rounded-full bg-[#3286C8]/15 px-2 py-0.5 text-xs font-medium text-[#0A2B4A]"
            >
              {v}
            </m.span>
          ))
        ) : (
          <span className="text-sm text-slate-400">Any</span>
        )}
        <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
}

function SettingsCard({ step, reduced }: { step: number; reduced: boolean }) {
  const on = step >= 1;
  return (
    <div>
      <PageHeader
        compact
        title="Settings"
        actions={<span className="inline-flex h-9 items-center rounded-full bg-[#0A2B4A] px-4 text-sm font-semibold text-white"><Save className="mr-2 h-4 w-4" />Save settings</span>}
      />
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-5">
          <p className="text-lg font-semibold leading-none tracking-tight text-[#081729]">Shared broker contacts</p>
          <p className="mt-1.5 text-sm text-slate-500">New groups start opted out. A group must enable the shared directory before those broker contacts appear in its CRM.</p>
        </div>
        <div className="space-y-5 border-t border-slate-100 p-5">
          <div className={`flex items-start gap-3 rounded-lg border p-4 transition-colors duration-300 ${on ? "border-[#3286C8]/50 bg-[#3286C8]/5" : "border-slate-200 bg-slate-50"}`}>
            <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors duration-200 ${on ? "border-[#0A2B4A] bg-[#0A2B4A]" : "border-slate-400 bg-white"}`}>
              {on && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </span>
            <span>
              <span className="block text-sm font-medium text-slate-800">Opt in to shared broker contacts</span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">When enabled, members can browse matching shared contacts. Company-owned contacts, CRM tags, notes, assignments, and outreach history remain private.</span>
            </span>
          </div>
          {on ? (
            <m.div initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={T_ENTER} className="grid grid-cols-2 gap-4">
              <Multi label="Sectors" values={["Multifamily", "Land"]} show={step >= 2} reduced={reduced} />
              <Multi label="States" values={["TX", "GA", "NC"]} show={step >= 2} reduced={reduced} />
              <Multi label="Counties" values={[]} show={false} reduced={reduced} />
              <Multi label="Source tags" values={[]} show={false} reduced={reduced} />
            </m.div>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">Shared broker contacts are hidden. Your company-owned contacts remain available in the CRM.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- pages/developer-crm.tsx: Company contacts ---------------- */

const TH = "px-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7d909f]";
const SEL = "inline-flex h-8 items-center gap-1 rounded-md border bg-white px-2.5 text-xs font-medium transition-colors duration-300";

function initials(n: string) {
  return n.split(" ").map((p) => p[0]).join("").slice(0, 2);
}

function Crm({ rows, total, stateNc, newNames, reduced }: { rows: DemoContact[]; total: number; stateNc: boolean; newNames: string[]; reduced: boolean }) {
  return (
    <div className="ll-partner-main text-[#172b3d]">
      <PageHeader
        compact
        title="Company contacts"
        actions={
          <>
            <span className="inline-flex h-9 items-center rounded-full border border-[#3286C8] bg-[#3286C8] px-4 text-sm font-semibold text-white"><Plus className="mr-2 h-4 w-4" />Add contact</span>
            <span className="inline-flex h-9 items-center rounded-full border border-[#b8c9d8] bg-white px-4 text-sm font-semibold text-[#081729]"><Upload className="mr-2 h-4 w-4" />Import contacts</span>
          </>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#dce5eb] bg-[#fbfcfd] shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-[#e3e9ee] bg-[#f8fafb] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A2B4A] text-white"><Users className="h-5 w-5" /></span>
            <div>
              <p className="font-semibold text-[#1d3448]">Contacts</p>
              <p className="text-xs text-[#7b8d9b]">{rows.length === total ? `${total} contacts` : `${rows.length} of ${total} contacts`}</p>
            </div>
          </div>
          <div className="relative w-[300px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#91a2af]" />
            <div className="flex h-10 items-center rounded-lg border border-[#d7e2e9] bg-white pl-10 text-sm text-[#91a2af]">Search name, email, company…</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#e6edf1] bg-[#f8fafb] px-5 py-3 text-xs text-[#718493]">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8193a1]">Filters</span>
          <span className={`${SEL} border-[#d7e2e9] text-[#405a70]`}>Source tags: All</span>
          <span className={`${SEL} ${stateNc ? "border-[#3286C8] text-[#0A2B4A] ring-1 ring-[#3286C8]" : "border-[#d7e2e9] text-[#405a70]"}`}>State: {stateNc ? "NC" : "All"}</span>
          <span className={`${SEL} border-[#d7e2e9] text-[#405a70]`}>Category: All</span>
          <span className={`${SEL} border-[#d7e2e9] text-[#405a70]`}>Rep: All</span>
          <span className="h-8 rounded-md px-2 text-xs font-medium leading-8 text-[#3286C8]">Clear filters</span>
        </div>
        <div className="ll-partner-crm-layout">
        <div className="ll-partner-table-wrap">
        <table className="w-full">
          <thead>
            <tr className="h-10 border-b border-[#e3e9ee] bg-[#f8fafb]">
              <th className={`${TH} pl-5`}>Name</th>
              <th className={TH}>Brokerage</th>
              <th className={TH}>Region</th>
              <th className={TH}>Category</th>
              <th className={TH}>Source tags</th>
              <th className={TH}>Source</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((c) => (
                <m.tr
                  key={c.name}
                  layout={reduced ? false : "position"}
                  initial={reduced ? false : { opacity: 0, y: -12, backgroundColor: "rgba(219,234,254,1)" }}
                  animate={{ opacity: 1, y: 0, backgroundColor: "rgba(251,252,253,1)" }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ ...T_LAYOUT, backgroundColor: { duration: 1.4 } }}
                  className="h-[46px] border-b border-[#e8edf1]"
                >
                  <td className="pl-5 pr-3">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#fbfcfd] text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: c.color }}>{initials(c.name)}</span>
                      <span className="whitespace-nowrap text-sm font-semibold text-[#21394c]">{c.name}</span>
                    </span>
                  </td>
                  <td className="max-w-[150px] truncate px-3 text-sm text-[#5f7382]">{c.brokerage}</td>
                  <td className="whitespace-nowrap px-3 text-sm text-[#5f7382]">{c.region}</td>
                  <td className="px-3 text-sm capitalize text-[#5f7382]">{c.category}</td>
                  <td className="px-3">
                    <span className="flex flex-wrap gap-1">
                      {c.sourceTags.length ? (
                        c.sourceTags.map((t) => (
                          <span key={t} className="rounded-full border border-[#d7e7d7] bg-[#f2f8f1] px-2 py-0.5 text-[10px] font-medium text-[#4d7351]">{t}</span>
                        ))
                      ) : (
                        <span className="text-sm text-[#9aa9b4]">—</span>
                      )}
                    </span>
                  </td>
                  <td className="px-3">
                    {c.source === "DealLinq" ? (
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${newNames.includes(c.name) ? "border-[#d7e1e7] bg-[#f8fafb] text-[#718493]" : "border-[#d7e1e7] bg-[#f8fafb] text-[#718493]"}`}>{BRAND_NAME}</span>
                    ) : (
                      <span className="inline-flex items-center whitespace-nowrap rounded-full border border-[#0A2B4A]/20 bg-[#0A2B4A]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0A2B4A]"><UserCheck className="mr-1 h-3 w-3" />Your contact</span>
                    )}
                  </td>
                </m.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        </div>
        <aside className="ll-partner-detail">
          <small>BEST MATCH</small>
          <h3>Alex Rivera</h3>
          <p className="text-xs text-slate-500">Oakridge Land Partners · Wake County, NC</p>
          <div className="ll-partner-match-score"><strong>96%</strong><span>Acquisition criteria match</span></div>
          <dl>
            <div><dt>Focus</dt><dd>Land · Multifamily</dd></div>
            <div><dt>Market</dt><dd>Raleigh-Durham</dd></div>
            <div><dt>Recent activity</dt><dd>3 new listings</dd></div>
            <div><dt>Shared source</dt><dd>{BRAND_NAME} network</dd></div>
          </dl>
        </aside>
        </div>
      </div>
    </div>
  );
}
