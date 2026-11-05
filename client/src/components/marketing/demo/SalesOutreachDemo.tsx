import { AnimatePresence, LazyMotion, domMax, m } from "framer-motion";
import { CheckCircle2, Mail, MapPin, PenLine, Rocket, Send, Sparkles, Tag, Users, X } from "lucide-react";
import { BRAND_NAME } from "@/config/brand";
import { MockWindow, ScaleToFit } from "./MockWindow";
import { AppToast, Badge, Btn, PageHeader, SALES_NAV } from "./ui-replicas";
import { ClientShell } from "./DealDashboardParts";
import {
  INSURANCE_BRAND,
  SALES_ASSIST_BODY,
  SALES_ASSIST_PROMPT,
  SALES_ASSIST_SUBJECT,
  SALES_AUDIENCE,
  SALES_CAMPAIGNS,
  SALES_LAUNCH_ENROLLED,
  SALES_SENDER,
} from "./sales-demo-data";
import { T_ENTER, useCountUp, useDemoTimeline, useStreamText } from "./useDemoTimeline";

/*
 * General Sales profile Outreach: pages/developer-outreach.tsx (/developer/outreach, live bundle
 * developer-outreach chunk): "Campaigns" page, "Edit campaign" dialog with the Writing assistant panel.
 * The real page copy mentions brokers (placeholders and token help); that copy is kept verbatim.
 * Steps: 1 Edit campaign opens · 2 assistant prompt · 3 suggested draft streams · 4 Insert into email
 *        5 Status -> Active · 6 Save -> "Campaign updated" · 7 Launch -> "Campaign launched"
 */
const CUES = [1300, 2400, 3300, 6600, 7700, 8800, 10800];

const ARIA = `Animated preview of an insurance agency's ${BRAND_NAME} Outreach Campaigns page: a policy renewal campaign is opened, the writing assistant drafts a warmer email that is inserted into the campaign, the campaign is set active and saved, then launched to eligible contacts.`;

const CARD = "rounded-2xl border border-slate-200 bg-white shadow-sm";
const IconBox = ({ children }: { children: React.ReactNode }) => <div className="rounded-xl bg-[#3286C8]/15 p-2 text-[#3286C8]">{children}</div>;

export default function SalesOutreachDemo() {
  const tl = useDemoTimeline<HTMLDivElement>({ cues: CUES, totalMs: 15000, mobileCues: CUES, mobileTotalMs: 15000 });
  const { step, reduced, loopKey } = tl;
  const target = SALES_CAMPAIGNS[0];
  const saved = step >= 6;
  const launched = step >= 7;
  const enrolled = useCountUp(SALES_LAUNCH_ENROLLED, launched, { duration: 900, reduced });
  const campaigns = SALES_CAMPAIGNS.map((c) =>
    c.id === target.id && saved ? { ...c, status: "active" as const, enrolled: launched ? Math.round(enrolled) : 0 } : c,
  );
  const dialog = step >= 1 && step < 6;
  const toast: [string, string | undefined] | null = step >= 7 ? ["Campaign launched", `${SALES_LAUNCH_ENROLLED} contacts enrolled; 0 already enrolled.`] : step === 6 ? ["Campaign updated", undefined] : step === 4 ? ["Draft inserted", "The assistant suggestion was added below your current message. Save when ready."] : null;

  return (
    <LazyMotion features={domMax} strict>
      <div ref={tl.ref} className="ll-demo relative w-full" data-testid="demo-sales-outreach">
        <ScaleToFit>
          <MockWindow path="/developer/outreach" paused={tl.paused} onTogglePause={reduced ? undefined : tl.togglePause}>
            <div role="img" aria-label={ARIA}>
              <m.div key={loopKey} aria-hidden="true" initial={reduced || loopKey === 0 ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <ClientShell
                  active="Outreach"
                  expanded
                  nav={SALES_NAV}
                  brand={INSURANCE_BRAND}
                  bg="bg-slate-50"
                  overlay={
                    <>
                      <AnimatePresence>{dialog && <EditDialog key="dlg" step={step} reduced={reduced} />}</AnimatePresence>
                      <AnimatePresence mode="wait">
                        {toast && (
                          <m.div key={toast[0]} className="absolute bottom-5 right-5 z-40" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={T_ENTER}>
                            <AppToast title={toast[0]} description={toast[1]} />
                          </m.div>
                        )}
                      </AnimatePresence>
                    </>
                  }
                >
                  <PageHeader compact title="Campaigns" />
                  <div className="mb-5 grid grid-cols-3 gap-4">
                    <div className={`col-span-2 ${CARD}`}>
                      <div className="flex items-center gap-2 px-6 pb-3 pt-5 text-lg font-semibold text-slate-900"><IconBox><Mail className="h-4 w-4" /></IconBox>Sending account</div>
                      <div className="flex items-center justify-between gap-4 px-6 pb-5">
                        <div>
                          <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><p className="font-semibold text-slate-900">{SALES_SENDER.name}</p></div>
                          <p className="mt-1 text-sm text-slate-600">{SALES_SENDER.email}</p>
                          <p className="mt-1 text-xs text-slate-500">Campaigns send through this Microsoft Outlook account.</p>
                          <div className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-600">
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Signature preview</p>
                            {SALES_SENDER.signature}
                          </div>
                        </div>
                        <Btn variant="outline"><PenLine className="mr-2 h-4 w-4" />Edit</Btn>
                      </div>
                    </div>
                    <div className={CARD}>
                      <div className="flex items-center gap-2 px-6 pb-3 pt-5 text-lg font-semibold text-slate-900"><IconBox><Users className="h-4 w-4" /></IconBox>Target audience</div>
                      <div className="px-6 pb-5">
                        <p className="text-3xl font-bold text-slate-950">{SALES_AUDIENCE}</p>
                        <p className="mt-1 text-sm text-slate-500">Eligible owned and shared contacts</p>
                        <div className="mt-3 flex items-start gap-2 text-xs text-slate-600"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>All available contacts</span></div>
                      </div>
                    </div>
                  </div>
                  <div className={CARD}>
                    <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 text-lg font-semibold text-slate-900"><IconBox><Send className="h-4 w-4" /></IconBox>Your campaigns</div>
                    <div className="divide-y divide-slate-100">
                      {campaigns.map((c) => (
                        <div key={c.id} className={`flex items-center justify-between gap-4 p-5 transition-colors duration-500 ${c.id === target.id && (step === 6 || step === 7) ? "bg-blue-50/60" : ""}`}>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-slate-900">{c.name}</p>
                              <Badge variant={c.status === "active" ? "default" : "custom"} className={c.status === "active" ? "" : "border-transparent bg-slate-100 text-slate-900"}>{c.status}</Badge>
                              {c.status === "active" && c.triggerTag && <Badge variant="outline" className="gap-1 font-normal"><Tag className="h-3 w-3" />{c.triggerTag}</Badge>}
                            </div>
                            <p className="mt-1 text-sm text-slate-500">{c.subject}</p>
                            <p className="mt-2 text-xs text-slate-400">{c.enrolled} enrolled · starts {c.dayNumber ? `after ${c.dayNumber} day${c.dayNumber === 1 ? "" : "s"}` : "immediately"}</p>
                          </div>
                          <div className="flex gap-2">
                            <Btn variant="outline" size="xs" className={c.id === target.id && step === 1 ? "ring-2 ring-[#4A90E2]/40" : ""}><PenLine className="mr-1.5 h-4 w-4" />Campaign</Btn>
                            <Btn variant="outline" size="xs"><PenLine className="mr-1.5 h-4 w-4" />Steps</Btn>
                            <Btn size="xs" className={c.id === target.id && step >= 7 ? "ring-2 ring-[#4A90E2]/40" : ""}><Rocket className="mr-1.5 h-4 w-4" />Launch</Btn>
                          </div>
                        </div>
                      ))}
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

function Field({ label, value, placeholder, hit = false, help }: { label: string; value?: string; placeholder?: string; hit?: boolean; help?: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-900">{label}</p>
      <div className={`mt-1.5 flex h-9 items-center rounded-md border px-3 text-sm transition-colors duration-300 ${hit ? "border-[#4A90E2] bg-blue-50/40 ring-2 ring-[#4A90E2]/20" : "border-[hsl(220_13%_91%)] bg-white"}`}>
        {value ? <span className="truncate text-slate-900">{value}</span> : <span className="text-slate-400">{placeholder}</span>}
      </div>
      {help && <p className="mt-1 text-[11px] leading-4 text-slate-500">{help}</p>}
    </div>
  );
}

function EditDialog({ step, reduced }: { step: number; reduced: boolean }) {
  const c = SALES_CAMPAIGNS[0];
  const inserted = step >= 4;
  const reply = useStreamText(SALES_ASSIST_BODY, step >= 3, { msPerToken: 22, reduced }).text;
  const original = "Hi {{firstName}},\n\nYour policy renews soon. Let's review your coverage.\n\nJordan";
  const body = inserted ? `${original}\n\n${SALES_ASSIST_BODY}` : original;
  return (
    <m.div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 px-6" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <m.div className="relative w-full max-w-[1080px] rounded-lg border border-[hsl(220_13%_91%)] bg-white px-6 py-5 shadow-lg" initial={reduced ? false : { scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={T_ENTER}>
        <span className="absolute right-4 top-4 text-slate-400"><X className="h-4 w-4" /></span>
        <h2 className="text-lg font-semibold text-slate-900">Edit campaign</h2>
        <p className="mt-1 text-sm text-slate-500">Email will send only from your connected Outlook account. Launching uses your saved target geography; tagged contacts can also enroll automatically.</p>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_360px] gap-6">
          <div className="grid content-start gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Campaign name" value={c.name} placeholder="Broker introduction" />
              <Field label="Subject line" value={c.subject} placeholder="A quick introduction" />
            </div>
            <Field label="Auto-enrollment tag" value={c.triggerTag} placeholder="Interested Broker" help="Contacts owned by your company are enrolled when this exact CRM tag is added. Geography targeting remains available when you launch the campaign." />
            <div>
              <p className="text-sm font-medium text-slate-900">Email message</p>
              <div className={`mt-1.5 h-[118px] overflow-hidden whitespace-pre-line rounded-md border px-3 py-2 text-[12px] leading-[17px] text-slate-700 transition-colors duration-300 ${step === 4 ? "border-[#4A90E2] ring-2 ring-[#4A90E2]/20" : "border-[hsl(220_13%_91%)]"}`}>{body}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Send delay in days" value={String(c.dayNumber)} />
              <div>
                <p className="text-sm font-medium text-slate-900">Status</p>
                <div className="mt-1.5 flex h-9 rounded-md border border-[hsl(220_13%_91%)] p-0.5 text-sm">
                  {["Draft / paused", "Active"].map((s, i) => {
                    const on = (i === 1) === step >= 5;
                    return <span key={s} className={`flex flex-1 items-center justify-center rounded transition-colors duration-300 ${on ? "bg-[#081729] text-white" : "text-slate-600"}`}>{s}</span>;
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-[330px] flex-col rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Sparkles className="h-4 w-4 text-[#3286C8]" />Writing assistant</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">Ask for a rewrite, tone change, shorter copy, or a follow-up. The assistant uses this company's saved criteria and current draft.</p>
            <div className="mt-2 flex-1 space-y-2 overflow-hidden">
              <AnimatePresence initial={false}>
                {step >= 2 && (
                  <m.div key="u" initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="ml-5 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">{SALES_ASSIST_PROMPT}</m.div>
                )}
                {step >= 3 && (
                  <m.div key="a" initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mr-5 rounded-lg border border-blue-200 bg-blue-50/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Suggested draft</p>
                    <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-900">{SALES_ASSIST_SUBJECT}</p>
                    <p className="mt-1 line-clamp-3 text-xs text-slate-600">{reply}</p>
                    <div className="mt-2 flex gap-2">
                      <Btn size="xs" className={step === 4 ? "ring-2 ring-[#4A90E2]/40" : ""}>Insert into email</Btn>
                      <Btn size="xs" variant="outline">Replace draft</Btn>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-2 h-12 rounded-md border border-[hsl(220_13%_91%)] bg-white px-3 py-2 text-xs text-slate-400">e.g. Make it more direct…</div>
            <p className="mt-1 text-[10px] text-slate-400">Ctrl/⌘ + Enter to send. Suggestions never change the email until you choose an action.</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Btn variant="outline">Cancel</Btn>
          <Btn className={step >= 5 ? "ring-2 ring-[#4A90E2]/30" : ""}>Save Campaign</Btn>
        </div>
      </m.div>
    </m.div>
  );
}
