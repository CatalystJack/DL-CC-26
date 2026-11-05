import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Building2, Loader2, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ManagedAccount = {
  id: string;
  companyName: string;
  slug: string;
  profileType: string;
  assetClass: string;
  isActive: boolean;
  isDemoAccount: boolean;
  targetStates: string[];
  minAcres: string | null;
  minRentPsf: string | null;
  totalDeals: number;
  greenDeals: number;
  reviewDeals: number;
  pursuingDeals: number;
  lastDealActivity: string | null;
};

type ManagedDeal = {
  id: string;
  property_name: string | null;
  address: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  owner_name: string | null;
  status: string | null;
  classification: string | null;
  asking_price: string | null;
  size_acres: string | null;
  unit_count: number | null;
  vintage: number | null;
  document_urls: string[] | null;
  analyst_document_urls: string[] | null;
  deal_summary: string | null;
  developer_summary: string | null;
  ai_explanatory_notes: string | null;
  underwriting_state: string | null;
  yield_on_cost: string | null;
  irr: string | null;
  automated_yoc: string | null;
  automated_irr: string | null;
  projected_noi: string | null;
  total_project_cost: string | null;
  is_demo_account: boolean;
  pipeline_stage: string;
};

type UnderwritingModel = {
  id: string;
  name: string;
  dua: string | null;
  hardCostPu: string | null;
  assumedLandCostPu: string | null;
  assumedLandCostPuCoastal: string | null;
  softCostPct: string | null;
  otherIncomePum: string | null;
  fixedOpExPu: string | null;
  insurancePuNc: string | null;
  insurancePuCoastal: string | null;
  vacancyPct: string | null;
  ltlPct: string | null;
  concessionPct: string | null;
  badDebtPct: string | null;
  mgmtFeePct: string | null;
  rentGrowthPct: string | null;
  otherIncomeGrowthPct: string | null;
  expenseGrowthPct: string | null;
  holdPeriodYears: number | null;
  exitCapRatePct: string | null;
};

const underwritingFields: { key: keyof UnderwritingModel; label: string }[] = [
  { key: "dua", label: "Density units per acre" },
  { key: "hardCostPu", label: "Hard cost per unit" },
  { key: "assumedLandCostPu", label: "Land cost per unit" },
  { key: "assumedLandCostPuCoastal", label: "Coastal land cost per unit" },
  { key: "softCostPct", label: "Soft cost percentage" },
  { key: "otherIncomePum", label: "Other income per unit monthly" },
  { key: "fixedOpExPu", label: "Fixed operating expense per unit" },
  { key: "insurancePuNc", label: "North Carolina insurance per unit" },
  { key: "insurancePuCoastal", label: "Coastal insurance per unit" },
  { key: "vacancyPct", label: "Vacancy rate" },
  { key: "ltlPct", label: "Loss to lease rate" },
  { key: "concessionPct", label: "Concession rate" },
  { key: "badDebtPct", label: "Bad debt rate" },
  { key: "mgmtFeePct", label: "Management fee rate" },
  { key: "rentGrowthPct", label: "Rent growth rate" },
  { key: "otherIncomeGrowthPct", label: "Other income growth rate" },
  { key: "expenseGrowthPct", label: "Expense growth rate" },
  { key: "holdPeriodYears", label: "Hold period in years" },
  { key: "exitCapRatePct", label: "Exit cap rate" },
];

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed");
  return body as T;
}

export default function AccountManagerHome() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [accounts, setAccounts] = useState<ManagedAccount[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [slug, setSlug] = useState("");
  const [states, setStates] = useState("");
  const [minAcres, setMinAcres] = useState("0");
  const [minRentPsf, setMinRentPsf] = useState("");
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [openedAccountId, setOpenedAccountId] = useState("");
  const [dealsByAccount, setDealsByAccount] = useState<Record<string, ManagedDeal[]>>({});
  const [dealsLoadingId, setDealsLoadingId] = useState("");
  const [underwritingByAccount, setUnderwritingByAccount] = useState<Record<string, UnderwritingModel[]>>({});
  const [underwritingSavingId, setUnderwritingSavingId] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await request<{ accounts: ManagedAccount[] }>("/api/account-manager/accounts");
      setAccounts(result.accounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load managed accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const toggleAccountDeals = async (accountId: string) => {
    if (openedAccountId === accountId) {
      setOpenedAccountId("");
      return;
    }
    setOpenedAccountId(accountId);
    if (dealsByAccount[accountId] && underwritingByAccount[accountId]) return;
    setDealsLoadingId(accountId);
    try {
      const [dealResult, modelResult] = await Promise.all([
        request<{ deals: ManagedDeal[] }>(`/api/account-manager/accounts/${encodeURIComponent(accountId)}/deals`),
        request<{ models: UnderwritingModel[] }>(`/api/account-manager/accounts/${encodeURIComponent(accountId)}/underwriting`),
      ]);
      setDealsByAccount((current) => ({ ...current, [accountId]: dealResult.deals }));
      setUnderwritingByAccount((current) => ({ ...current, [accountId]: modelResult.models }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load account deals");
    } finally {
      setDealsLoadingId("");
    }
  };

  const saveUnderwriting = async (accountId: string, model: UnderwritingModel) => {
    setUnderwritingSavingId(model.id);
    setError("");
    setNotice("");
    const assumptions = Object.fromEntries(
      underwritingFields.map(({ key }) => [key, model[key] === "" ? null : model[key]]),
    );
    try {
      const result = await request<{ models: UnderwritingModel[] }>(
        `/api/account-manager/accounts/${encodeURIComponent(accountId)}/underwriting`,
        { method: "PATCH", body: JSON.stringify({ models: [{ id: model.id, assumptions }] }) },
      );
      setUnderwritingByAccount((current) => ({ ...current, [accountId]: result.models }));
      setNotice(`Underwriting assumptions saved for ${model.name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save underwriting assumptions");
    } finally {
      setUnderwritingSavingId("");
    }
  };

  const createAccount = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      if (editingAccountId) {
        await request<{ profile: ManagedAccount }>(`/api/account-manager/accounts/${encodeURIComponent(editingAccountId)}/criteria`, {
          method: "PATCH",
          body: JSON.stringify({
            targetStates: states.split(",").map((value) => value.trim().toUpperCase()).filter(Boolean),
            minAcres,
            minRentPsf: minRentPsf || null,
          }),
        });
        setNotice("Acquisition criteria updated.");
        setEditingAccountId(null);
        await load();
      } else {
        const result = await request<{ profile: ManagedAccount }>("/api/account-manager/accounts", {
          method: "POST",
          body: JSON.stringify({
          companyName: companyName.trim(),
          slug: slug.trim().toLowerCase(),
          profileType: "real_estate",
          assetClass: "multifamily",
          primaryColor: "#0A2B4A",
          secondaryColor: "#4A90E2",
          rentMetric: "psf",
          minAcres,
          minRentPsf: minRentPsf || null,
          minRentPerUnit: null,
          targetStates: states.split(",").map((value) => value.trim().toUpperCase()).filter(Boolean),
          targetCounties: [],
          }),
        });
        setAccounts((current) => [...current, result.profile]);
        setNotice("Acquisition group created.");
      }
      setCompanyName("");
      setSlug("");
      setStates("");
      setMinAcres("0");
      setMinRentPsf("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create acquisition group");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F8FB] font-sans text-[#000914]">
      <header className="border-b border-slate-200 bg-[#000914] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">DealLinq</p>
            <h1 className="mt-1 text-xl font-semibold">Account manager workspace</h1>
          </div>
          <div className="text-right text-sm">
            <p>{[user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email}</p>
            <button className="mt-1 text-sky-200 underline underline-offset-4" onClick={async () => {
              await fetch("/api/logout", { method: "POST", credentials: "include" });
              window.location.assign("/login");
            }}>Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,.9fr)]">
        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#4A90E2]">Book of business</p>
              <h2 className="mt-1 text-2xl font-semibold">Managed acquisition groups</h2>
            </div>
            <Button variant="outline" onClick={() => void load()} disabled={loading} aria-label="Refresh accounts">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
          {error && <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
          {notice && <p role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
          {loading ? (
            <Card><CardContent className="flex items-center gap-3 py-10 text-slate-500"><Loader2 className="h-5 w-5 animate-spin" />Loading accounts</CardContent></Card>
          ) : accounts.length ? (
            <div className="grid gap-3">
               {accounts.map((account) => (
                 <Card key={account.id}>
                   <CardContent className="space-y-4 p-4 sm:p-5">
                     <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                       <div className="flex min-w-0 items-start gap-3">
                         <div className="rounded-lg bg-sky-50 p-2 text-[#4A90E2]"><Building2 className="h-5 w-5" /></div>
                         <div className="min-w-0">
                           <div className="flex flex-wrap items-center gap-2">
                             <h3 className="font-semibold">{account.companyName}</h3>
                             {account.isDemoAccount && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">SAMPLE</span>}
                           </div>
                           <p className="text-sm text-slate-500">
                             {(account.targetStates || []).join(", ") || "Markets not set"} · {account.minAcres ?? "0"} minimum acres
                             {account.minRentPsf ? ` · $${account.minRentPsf}/SF minimum rent` : ""}
                           </p>
                           <p className="mt-1 text-xs text-slate-500">
                             {account.totalDeals} deals · {account.greenDeals} Green · {account.reviewDeals} Yellow · {account.pursuingDeals} pursuing
                             {account.lastDealActivity ? ` · activity ${new Date(account.lastDealActivity).toLocaleDateString()}` : ""}
                           </p>
                         </div>
                       </div>
                       <div className="flex flex-wrap gap-2">
                         <Button variant="outline" onClick={() => void toggleAccountDeals(account.id)}>
                           {openedAccountId === account.id ? "Hide deals" : "View deals"}
                         </Button>
                         <Button variant="outline" onClick={() => {
                           setEditingAccountId(account.id);
                           setCompanyName(account.companyName);
                           setSlug(account.slug);
                           setStates((account.targetStates || []).join(", "));
                           setMinAcres(account.minAcres || "0");
                           setMinRentPsf(account.minRentPsf || "");
                         }}>Edit criteria</Button>
                       </div>
                     </div>
                     {openedAccountId === account.id && (
                       <div className="space-y-3 border-t border-slate-200 pt-4">
                         {dealsLoadingId === account.id ? (
                           <p className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading deal details</p>
                         ) : (dealsByAccount[account.id] || []).length ? (
                           dealsByAccount[account.id].map((deal) => {
                             const isSample = account.isDemoAccount || deal.is_demo_account || /^SAMPLE\b/i.test(deal.property_name || "");
                             const docs = [...(deal.document_urls || []), ...(deal.analyst_document_urls || [])]
                               .filter((url): url is string => typeof url === "string" && (/^https?:\/\//i.test(url) || (url.startsWith("/") && !url.startsWith("//"))));
                             return (
                               <article key={deal.id} className="rounded-xl border border-slate-200 bg-white p-4">
                                 <div className="flex flex-wrap items-center gap-2">
                                   <h4 className="font-semibold">{deal.property_name || deal.address}</h4>
                                   {isSample && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">SAMPLE</span>}
                                 </div>
                                 <p className="mt-1 text-sm text-slate-600">{deal.address}{deal.city ? `, ${deal.city}` : ""}{deal.state ? `, ${deal.state}` : ""} {deal.zip || ""}</p>
                                 {deal.owner_name && <p className="mt-1 text-sm text-slate-600"><span className="font-medium">Owner:</span> {deal.owner_name}</p>}
                                 <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                                   <p><span className="font-medium">Pipeline:</span> {deal.pipeline_stage || "New"}</p>
                                   <p><span className="font-medium">Status:</span> {deal.status || "Not set"}</p>
                                   <p><span className="font-medium">Criteria match:</span> {deal.classification || "Not classified"}</p>
                                   <p><span className="font-medium">Asking price:</span> {deal.asking_price ? `$${Number(deal.asking_price).toLocaleString()}` : "Not set"}</p>
                                   <p><span className="font-medium">Size:</span> {deal.size_acres ? `${deal.size_acres} acres` : "Not set"}</p>
                                   <p><span className="font-medium">Units:</span> {deal.unit_count ?? "Not set"}</p>
                                   <p><span className="font-medium">Vintage:</span> {deal.vintage ?? "Not set"}</p>
                                   <p><span className="font-medium">Yield on cost:</span> {deal.automated_yoc || deal.yield_on_cost || "Not set"}</p>
                                   <p><span className="font-medium">IRR:</span> {deal.automated_irr || deal.irr || "Not set"}</p>
                                   <p><span className="font-medium">Projected NOI:</span> {deal.projected_noi ? `$${Number(deal.projected_noi).toLocaleString()}` : "Not set"}</p>
                                   <p><span className="font-medium">Project cost:</span> {deal.total_project_cost ? `$${Number(deal.total_project_cost).toLocaleString()}` : "Not set"}</p>
                                 </div>
                                 {(deal.deal_summary || deal.developer_summary) && <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{deal.deal_summary || deal.developer_summary}</p>}
                                 {deal.ai_explanatory_notes && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{deal.ai_explanatory_notes}</p>}
                                 {deal.underwriting_state && <details className="mt-3">
                                   <summary className="cursor-pointer text-sm font-semibold text-sky-800">Underwriting assumptions and returns</summary>
                                   <pre className="mt-2 max-h-72 overflow-auto rounded-lg bg-slate-50 p-3 text-xs">{(() => {
                                     try { return JSON.stringify(JSON.parse(deal.underwriting_state), null, 2); }
                                     catch { return deal.underwriting_state; }
                                   })()}</pre>
                                 </details>}
                                 <div className="mt-3">
                                   <p className="text-sm font-semibold">Files and documents</p>
                                   {docs.length ? <ul className="mt-1 list-inside list-disc text-sm">
                                     {docs.map((url, index) => <li key={`${url}-${index}`}><a className="break-all text-sky-800 underline" href={url} target="_blank" rel="noreferrer">Open document {index + 1}</a></li>)}
                                   </ul> : <p className="mt-1 text-sm text-slate-500">No documents attached.</p>}
                                 </div>
                               </article>
                             );
                           })
                         ) : <p className="text-sm text-slate-500">No deals are assigned to this account.</p>}
                          <section className="space-y-3 border-t border-slate-200 pt-4">
                            <div>
                              <h4 className="font-semibold">Account underwriting model</h4>
                              <p className="text-sm text-slate-500">Edit the assumptions used for this account. Rate values use decimals, such as 0.05 for 5%. Changes are recorded in the audit log.</p>
                            </div>
                            {(underwritingByAccount[account.id] || []).length ? (
                              underwritingByAccount[account.id].map((model) => (
                                <div key={model.id} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                                  <h5 className="font-medium">{model.name}</h5>
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    {underwritingFields.map(({ key, label }) => (
                                      <label key={key} className="space-y-1 text-sm">
                                        <span className="font-medium">{label}</span>
                                        <Input
                                          type="number"
                                          min="0"
                                          step={key === "holdPeriodYears" ? "1" : "0.01"}
                                          value={model[key] ?? ""}
                                          onChange={(event) => setUnderwritingByAccount((current) => ({
                                            ...current,
                                            [account.id]: (current[account.id] || []).map((item) => item.id === model.id
                                              ? { ...item, [key]: event.target.value }
                                              : item),
                                          }))}
                                        />
                                      </label>
                                    ))}
                                  </div>
                                  <Button
                                    variant="outline"
                                    disabled={underwritingSavingId === model.id}
                                    onClick={() => void saveUnderwriting(account.id, model)}
                                  >
                                    {underwritingSavingId === model.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save underwriting assumptions
                                  </Button>
                                </div>
                              ))
                            ) : <p className="text-sm text-slate-500">No product underwriting model is configured for this account.</p>}
                          </section>
                       </div>
                     )}
                   </CardContent>
                 </Card>
               ))}
            </div>
          ) : (
            <Card><CardContent className="py-10 text-center text-slate-500">No managed acquisition groups yet.</CardContent></Card>
          )}
        </section>

        <Card>
          <CardHeader><CardTitle>{editingAccountId ? "Edit acquisition criteria" : "Create an acquisition group"}</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={createAccount}>
              {!editingAccountId && <>
                <div className="space-y-2"><Label htmlFor="am-company">Company name</Label><Input id="am-company" required value={companyName} onChange={(event) => setCompanyName(event.target.value)} maxLength={120} /></div>
                <div className="space-y-2"><Label htmlFor="am-slug">Login slug</Label><Input id="am-slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={slug} onChange={(event) => setSlug(event.target.value)} maxLength={80} placeholder="example-company" /></div>
              </>}
              <div className="space-y-2"><Label htmlFor="am-states">Target states</Label><Input id="am-states" value={states} onChange={(event) => setStates(event.target.value)} placeholder="NC, SC, TN" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label htmlFor="am-acres">Minimum acres</Label><Input id="am-acres" type="number" min="0" step="0.1" value={minAcres} onChange={(event) => setMinAcres(event.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="am-rent">Minimum rent per square foot</Label><Input id="am-rent" type="number" min="0" step="0.01" value={minRentPsf} onChange={(event) => setMinRentPsf(event.target.value)} /></div>
              </div>
              <Button className="w-full bg-[#0A2B4A] text-white hover:bg-white hover:text-[#4A90E2]" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingAccountId ? "Save criteria" : "Create profile"}
              </Button>
              {editingAccountId && <Button type="button" variant="outline" className="w-full" onClick={() => {
                setEditingAccountId(null);
                setCompanyName("");
                setSlug("");
                setStates("");
                setMinAcres("0");
                setMinRentPsf("");
              }}>Cancel edit</Button>}
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
