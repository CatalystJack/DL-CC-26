import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Loader2, MapPin, Save } from "lucide-react";
import DeveloperNavigation from "@/components/developer-navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DEAL_PIPELINE_STAGES, type DealPipelineStage } from "@shared/deal-pipeline";

type StageChange = {
  fromStage: DealPipelineStage;
  toStage: DealPipelineStage;
  changedAt: string;
  changedBy: string | null;
};

type PipelineDeal = {
  id: string;
  address: string;
  propertyName?: string | null;
  city?: string | null;
  state?: string | null;
  county?: string | null;
  unitCount?: number | null;
  vintage?: number | null;
  askingPrice?: string | null;
  classification?: string | null;
  stage: DealPipelineStage;
  stageHistory: StageChange[];
  notes: string | null;
};

type PipelineResponse = { stages: DealPipelineStage[]; deals: PipelineDeal[] };

async function requestJson(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Unable to update the deal pipeline");
  return body;
}

const money = (value?: string | null) => {
  if (!value) return "Price not provided";
  const numeric = Number(value);
  return Number.isFinite(numeric)
    ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(numeric)
    : "Price not provided";
};

function locationLabel(deal: PipelineDeal) {
  return [deal.city, deal.state].filter(Boolean).join(", ") || deal.county || "Location not provided";
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

export default function DeveloperDealPipeline() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [mobileStage, setMobileStage] = useState<DealPipelineStage>("New");
  const [search, setSearch] = useState("");
  const [notesDrafts, setNotesDrafts] = useState<Record<string, string>>({});
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [savingDealId, setSavingDealId] = useState<string | null>(null);

  const pipelineQuery = useQuery<PipelineResponse>({
    queryKey: ["/api/developer-profile/me/deal-pipeline"],
    queryFn: () => requestJson("/api/developer-profile/me/deal-pipeline"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ dealId, payload }: { dealId: string; payload: { stage?: DealPipelineStage; notes?: string } }) =>
      requestJson(`/api/developer-profile/me/deal-pipeline/${encodeURIComponent(dealId)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: (_result, variables) => {
      setSavingDealId(null);
      void queryClient.invalidateQueries({ queryKey: ["/api/developer-profile/me/deal-pipeline"] });
      if (variables.payload.stage) {
        toast({ title: "Stage updated", description: `Deal moved to ${variables.payload.stage}.` });
      } else {
        toast({ title: "Notes saved", description: "Your deal note was saved." });
      }
    },
    onError: (error: Error) => {
      setSavingDealId(null);
      toast({ title: "Could not update deal", description: error.message, variant: "destructive" });
    },
  });

  const allDeals = pipelineQuery.data?.deals || [];
  const filteredDeals = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allDeals;
    return allDeals.filter((deal) =>
      [deal.propertyName, deal.address, deal.city, deal.state, deal.county]
        .some((value) => String(value || "").toLowerCase().includes(query)),
    );
  }, [allDeals, search]);
  const visibleStages = pipelineQuery.data?.stages || DEAL_PIPELINE_STAGES;
  const mobileDeals = filteredDeals.filter((deal) => deal.stage === mobileStage);

  const moveDeal = (deal: PipelineDeal, stage: DealPipelineStage) => {
    if (deal.stage === stage) return;
    setSavingDealId(deal.id);
    updateMutation.mutate({ dealId: deal.id, payload: { stage } });
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>, stage: DealPipelineStage) => {
    event.preventDefault();
    const dealId = event.dataTransfer.getData("text/plain") || draggedDealId;
    const deal = allDeals.find((item) => item.id === dealId);
    if (deal) moveDeal(deal, stage);
    setDraggedDealId(null);
  };

  const saveNotes = (deal: PipelineDeal) => {
    setSavingDealId(deal.id);
    updateMutation.mutate({
      dealId: deal.id,
      payload: { notes: notesDrafts[deal.id] ?? deal.notes ?? "" },
    });
  };

  const renderDeal = (deal: PipelineDeal) => (
    <Card
      key={deal.id}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", deal.id);
        event.dataTransfer.effectAllowed = "move";
        setDraggedDealId(deal.id);
      }}
      onDragEnd={() => setDraggedDealId(null)}
      className={`border-slate-200 shadow-sm ${draggedDealId === deal.id ? "opacity-50" : ""}`}
      data-testid={`deal-pipeline-card-${deal.id}`}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/developer/deals/${encodeURIComponent(deal.id)}`}
            className="min-w-0 text-sm font-semibold leading-5 text-[#102d4c] hover:text-[#2878b9] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A90E2]"
          >
            {deal.propertyName || deal.address}
          </Link>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            {deal.classification || "Unclassified"}
          </span>
        </div>
        <p className="flex items-start gap-1.5 text-xs text-slate-600">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>{deal.propertyName ? `${deal.address}, ` : ""}{locationLabel(deal)}</span>
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
          <span>{money(deal.askingPrice)}</span>
          {deal.unitCount ? <span>{deal.unitCount.toLocaleString()} units</span> : null}
          {deal.vintage ? <span>Built {deal.vintage}</span> : null}
        </div>
        <label className="block md:hidden">
          <span className="mb-1 block text-xs font-medium text-slate-600">Move to stage</span>
          <Select value={deal.stage} onValueChange={(value) => moveDeal(deal, value as DealPipelineStage)}>
            <SelectTrigger className="min-h-11" aria-label={`Move ${deal.propertyName || deal.address} to stage`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {visibleStages.map((stage) => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>
        <details className="group border-t border-slate-100 pt-2">
          <summary className="min-h-10 cursor-pointer list-none py-2 text-xs font-semibold text-[#2878b9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A90E2]">
            Notes and stage history
          </summary>
          <div className="space-y-3 pt-1">
            <Textarea
              value={notesDrafts[deal.id] ?? deal.notes ?? ""}
              onChange={(event) => setNotesDrafts((current) => ({ ...current, [deal.id]: event.target.value }))}
              maxLength={5000}
              rows={3}
              aria-label={`Notes for ${deal.propertyName || deal.address}`}
              placeholder="Add a note for your company"
              className="text-sm"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="min-h-10 gap-2 border-[#b8cee5] text-[#102d4c] hover:bg-white hover:text-[#4A90E2]"
              onClick={() => saveNotes(deal)}
              disabled={savingDealId === deal.id}
            >
              {savingDealId === deal.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save note
            </Button>
            {deal.stageHistory.length ? (
              <ol className="space-y-2 border-l border-slate-200 pl-3 text-xs text-slate-600">
                {[...deal.stageHistory].reverse().map((change, index) => (
                  <li key={`${change.changedAt}-${index}`}>
                    <span className="font-medium text-slate-800">{change.fromStage} → {change.toStage}</span>
                    <span className="block">{formatDate(change.changedAt)}</span>
                  </li>
                ))}
              </ol>
            ) : <p className="text-xs text-slate-500">No stage changes recorded.</p>}
          </div>
        </details>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#f5f8fb]">
      <DeveloperNavigation />
      <main className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3286C8]">Deal management</p>
              <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#0A2B4A]">Deal pipeline</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Track your company’s deals through each stage. Stage and notes are private to your company.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <p className="text-sm text-slate-600">{filteredDeals.length} {filteredDeals.length === 1 ? "deal" : "deals"}</p>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search deals"
                aria-label="Search deals"
                className="min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 sm:w-64"
              />
            </div>
          </header>

          {pipelineQuery.isLoading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-600"><Loader2 className="h-5 w-5 animate-spin" />Loading your deal pipeline</div>
          ) : pipelineQuery.isError ? (
            <Card><CardContent className="p-6 text-sm text-red-700">Your deal pipeline could not be loaded. Refresh to try again.</CardContent></Card>
          ) : (
            <>
              <div className="md:hidden">
                <label className="block max-w-sm">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">View stage</span>
                  <Select value={mobileStage} onValueChange={(value) => setMobileStage(value as DealPipelineStage)}>
                    <SelectTrigger className="min-h-11 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>{visibleStages.map((stage) => <SelectItem key={stage} value={stage}>{stage} · {filteredDeals.filter((deal) => deal.stage === stage).length}</SelectItem>)}</SelectContent>
                  </Select>
                </label>
              </div>

              <section aria-label="Deal pipeline stages">
                <div className="hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                  {visibleStages.map((stage) => {
                    const stageDeals = filteredDeals.filter((deal) => deal.stage === stage);
                    return (
                      <section
                        key={stage}
                        onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }}
                        onDrop={(event) => handleDrop(event, stage)}
                        aria-label={`${stage}, ${stageDeals.length} deals`}
                        className="min-w-0 rounded-xl border border-slate-200 bg-slate-100/80 p-2.5"
                      >
                        <header className="mb-3 flex items-center justify-between gap-2 px-1">
                          <h2 className="text-sm font-semibold text-[#102d4c]">{stage}</h2>
                          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600">{stageDeals.length}</span>
                        </header>
                        <div className="min-h-48 space-y-3 rounded-lg">
                          {stageDeals.map(renderDeal)}
                          {!stageDeals.length && <p className="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-500">Drop a deal here</p>}
                        </div>
                      </section>
                    );
                  })}
                </div>
                <div
                  className="space-y-3 md:hidden"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, mobileStage)}
                >
                  {mobileDeals.map(renderDeal)}
                  {!mobileDeals.length && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
                      <p className="text-sm font-medium text-slate-700">No deals in {mobileStage}</p>
                      <p className="mt-1 text-xs text-slate-500">Choose another stage or move a deal here.</p>
                      <ArrowRight className="mx-auto mt-3 h-4 w-4 text-slate-400" />
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
