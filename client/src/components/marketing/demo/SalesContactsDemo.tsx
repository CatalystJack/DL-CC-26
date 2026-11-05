import { AnimatePresence, LazyMotion, domMax, m } from "framer-motion";
import { ArrowRight, Building2, BriefcaseBusiness, CheckCircle2, Mail, Plus, Search, Upload, Users } from "lucide-react";
import { BRAND_NAME } from "@/config/brand";
import { MockWindow, ScaleToFit } from "./MockWindow";
import { Btn, PageHeader, SALES_NAV } from "./ui-replicas";
import { ClientShell } from "./DealDashboardParts";
import { INSURANCE_BRAND, SALES_CONTACTS } from "./sales-demo-data";
import { T_LAYOUT, useDemoTimeline, useStreamText } from "./useDemoTimeline";

/*
 * General Sales profile CRM: the live /developer/crm bundle ("Company contacts", developer-crm chunk)
 * with components/developer-onboarding-checklist.tsx above it (general_sales variant: step 5 is
 * "Review your sales pipeline"). The CRM table keeps its real "Brokerage" column label for every profile.
 * Steps: 1 "Add your first contacts" completes · 2 page scrolls to the contacts table
 *        3 search types a prospect's name · 4 table narrows to the matching contact
 */
const CUES = [900, 2600, 6200, 7600];
const QUERY = "Grace";
const EXTRA_SALES_CONTACTS = [
  { name: "Elise Warren", email: "elise@hawthornehardware.com", phone: "(919) 555-2381", company: "Hawthorne Hardware", companySub: "Commercial package review", region: "Greensboro, North Carolina", category: "other", tags: ["Commercial", "Prospect"], color: "#7c8fa3" },
  { name: "Marcus Bell", email: "marcus@blueridgepediatrics.com", phone: "(828) 555-6190", company: "Blue Ridge Pediatrics", companySub: "Professional liability renewal", region: "Asheville, North Carolina", category: "other", tags: ["Renewal Q1", "Client"], color: "#22a06b" },
  { name: "Renee Foster", email: "renee@magnoliamarketcafe.com", phone: "(615) 555-8147", company: "Magnolia Market Café", companySub: "Workers compensation quote", region: "Nashville, Tennessee", category: "other", tags: ["Quote sent"], color: "#a855f7" },
  { name: "Camille Davis", email: "camille@harborlightdesign.com", phone: "(843) 555-4072", company: "Harborlight Design Studio", companySub: "Business owners policy", region: "Charleston, South Carolina", category: "other", tags: ["Referral", "Prospect"], color: "#ef4444" },
  { name: "Andre Mitchell", email: "andre@stonecreekbuilders.com", phone: "(404) 555-7196", company: "Stone Creek Builders", companySub: "Contractor coverage review", region: "Atlanta, Georgia", category: "other", tags: ["Commercial", "Renewal Q2"], color: "#3286c8" },
];

const ARIA = `Animated preview of an insurance agency's ${BRAND_NAME} CRM: the getting-started checklist marks contacts as added, the page scrolls to the company contacts table, and a search narrows the list to matching policy prospects.`;

const STEPS = [
  { id: "profile", title: "Review company profile", d: "Confirm your company details and workspace settings.", icon: Building2, optional: false, done: true },
  { id: "team", title: "Set up your team", d: "Add a teammate when you are ready to work together.", icon: Users, optional: true, done: true },
  { id: "contacts", title: "Add your first contacts", d: "Add a contact or import a list into your company CRM.", icon: Users, optional: true, done: false, action: "Open contacts" },
  { id: "email", title: "Connect your email", d: "Connect a sender to use company outreach tools.", icon: Mail, optional: true, done: true },
  { id: "pipeline", title: "Review your sales pipeline", d: "Check the stages your team will use to track opportunities.", icon: BriefcaseBusiness, optional: true, done: false, action: "Open pipeline" },
];

export default function SalesContactsDemo() {
  const tl = useDemoTimeline<HTMLDivElement>({ cues: CUES, totalMs: 12500, mobileCues: CUES, mobileTotalMs: 12500 });
  const { step, reduced, loopKey } = tl;
  const typed = useStreamText(QUERY, step >= 3, { msPerToken: 160, reduced }).text;
  const q = step >= 4 ? QUERY : "";
  const rows = [...SALES_CONTACTS, ...EXTRA_SALES_CONTACTS].filter((c) => !q || `${c.name} ${c.email} ${c.company}`.toLowerCase().includes(q.toLowerCase()));
  const steps = STEPS.map((s) => (s.id === "contacts" && step >= 1 ? { ...s, done: true } : s));
  const handled = steps.filter((s) => s.done).length;

  return (
    <LazyMotion features={domMax} strict>
      <div ref={tl.ref} className="ll-demo relative w-full" data-testid="demo-sales-contacts">
        <ScaleToFit>
          <MockWindow path="/developer/crm" paused={tl.paused} onTogglePause={reduced ? undefined : tl.togglePause}>
            <div role="img" aria-label={ARIA}>
              <m.div key={loopKey} className="ll-sales-contacts-canvas" aria-hidden="true" initial={reduced || loopKey === 0 ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <ClientShell active="CRM" expanded nav={SALES_NAV} brand={INSURANCE_BRAND} bg="bg-[#f3f6f9]">
                  <m.div animate={{ y: step >= 2 ? -470 : 0 }} transition={reduced ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                    <PageHeader
                      compact
                      title="Company contacts"
                      actions={
                        <>
                          <Btn><Plus className="mr-2 h-4 w-4" />Add contact</Btn>
                          <Btn variant="outline"><Upload className="mr-2 h-4 w-4" />Import company contacts</Btn>
                        </>
                      }
                    />
                    <div className="mb-6 overflow-hidden rounded-lg border border-[#b8d8f5] bg-white shadow-sm">
                      <div className="border-l-4 border-[#4A90E2] px-5 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2f73bb]">Getting started</p>
                            <h2 className="mt-1 font-serif text-xl text-[#07172A]">Set up your company workspace</h2>
                            <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-600">Review the basics and shape a workspace your sales team can use together. Optional steps can be skipped and revisited later.</p>
                          </div>
                          <span className="shrink-0 text-sm font-medium text-slate-600">{handled} of {steps.length} steps complete or skipped</span>
                        </div>
                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-[#3286C8] transition-[width] duration-700" style={{ width: `${(handled / steps.length) * 100}%` }} />
                        </div>
                        <ol className="mt-3 space-y-2">
                          {steps.map((s, i) => {
                            const Icon = s.icon;
                            return (
                              <li key={s.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5">
                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${s.done ? "bg-emerald-100 text-emerald-700" : "bg-white text-[#3286C8]"}`}>
                                  {s.done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Step {i + 1}</span>
                                    <h3 className="text-sm font-semibold text-slate-800">{s.title}</h3>
                                    {s.optional && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">Optional</span>}
                                    {s.done && <span className="text-xs font-medium text-emerald-700">Complete</span>}
                                  </div>
                                  <p className="mt-0.5 text-sm leading-5 text-slate-600">{s.d}</p>
                                </div>
                                {s.done ? (
                                  <span className="px-2 text-sm font-medium text-emerald-700">Done</span>
                                ) : (
                                  <span className="flex gap-2">
                                    <Btn className="h-10">{s.action}<ArrowRight className="ml-2 h-4 w-4" /></Btn>
                                    <Btn variant="outline" className="h-10">Skip</Btn>
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-[#dce5eb] bg-[#fbfcfd] shadow-sm">
                      <div className="flex items-center justify-between gap-4 border-b border-[#e3e9ee] bg-[#f8fafb] px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3286C8] text-white"><Users className="h-5 w-5" /></div>
                          <div>
                            <h2 className="font-semibold text-[#1d3448]">Contacts</h2>
                            <p className="text-xs text-[#7b8d9b]">{rows.length} company contacts</p>
                          </div>
                        </div>
                        <div className={`relative flex h-10 w-[360px] items-center rounded-lg border bg-white pl-10 text-sm ${step === 3 ? "border-[#3286C8] ring-1 ring-[#3286C8]" : "border-[#d7e2e9]"}`}>
                          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#91a2af]" />
                          {typed ? <span className="text-[#21394c]">{typed}</span> : <span className="text-[#91a2af]">Search name, email, company…</span>}
                        </div>
                      </div>
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-[#e8edf1]">
                            {["Name", "Email", "Phone", "Brokerage", "Region", "Category", "Tags"].map((h) => (
                              <th key={h} className="h-12 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7d909f]">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <AnimatePresence initial={false}>
                            {rows.map((c) => (
                              <m.tr key={c.email} layout={!reduced} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={T_LAYOUT} className="h-[60px] border-b border-[#e8edf1]">
                                <td className="px-4">
                                  <span className="flex items-center gap-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#fbfcfd] text-[10px] font-bold text-white" style={{ backgroundColor: c.color }}>{c.name.split(" ").map((p) => p[0]).join("")}</span>
                                    <span className="whitespace-nowrap font-semibold text-[#21394c]">{c.name}</span>
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-4 text-sm text-[#5f7382]">{c.email}</td>
                                <td className="whitespace-nowrap px-4 text-sm text-[#5f7382]">{c.phone}</td>
                                <td className="px-4">
                                  <span className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 shrink-0 text-[#8a9ba8]" />
                                    <span className="min-w-0">
                                      <span className="block max-w-[170px] truncate text-sm font-medium text-[#405a70]">{c.company}</span>
                                      <span className="block text-[10px] text-[#8a9ba8]">{c.companySub}</span>
                                    </span>
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-4 text-sm text-[#5f7382]">{c.region}</td>
                                <td className="whitespace-nowrap px-4 text-sm capitalize text-[#5f7382]">{c.category}</td>
                                <td className="px-4">
                                  <span className="flex flex-wrap gap-1">
                                    {c.tags.map((t) => (
                                      <span key={t} className="whitespace-nowrap rounded-full border border-[#d8e6ee] bg-[#f4f8fb] px-2 py-1 text-[10px] font-medium text-[#405a70]">{t}</span>
                                    ))}
                                  </span>
                                </td>
                              </m.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  </m.div>
                </ClientShell>
              </m.div>
            </div>
          </MockWindow>
        </ScaleToFit>
      </div>
    </LazyMotion>
  );
}

