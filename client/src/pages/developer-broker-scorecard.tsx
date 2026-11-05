import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import DeveloperNavigation from "@/components/developer-navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import type { BrokerScorecardEntry } from "@shared/broker-scorecard";

type ScorecardResponse = { brokers: BrokerScorecardEntry[] };
type SortKey = keyof Pick<BrokerScorecardEntry, "rank" | "name" | "dealsSent" | "matchedDeals" | "loiDeals" | "underContractDeals" | "closedDeals" | "lastDealAt">;

async function loadScorecard(): Promise<ScorecardResponse> {
  const response = await fetch("/api/developer-profile/me/broker-scorecard", { credentials: "include" });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Unable to load broker scorecard");
  return body;
}

function dateLabel(value: string | null) {
  if (!value) return "No deals";
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date)
    : "Date unavailable";
}

export default function DeveloperBrokerScorecard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/developer-profile/me/broker-scorecard"],
    queryFn: loadScorecard,
  });
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [descending, setDescending] = useState(false);
  const brokers = data?.brokers || [];
  const sorted = useMemo(() => [...brokers].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const order = sortKey === "lastDealAt"
      ? String(av || "").localeCompare(String(bv || ""))
      : typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av || "").localeCompare(String(bv || ""));
    return (descending ? -order : order) || a.rank - b.rank || a.name.localeCompare(b.name);
  }), [brokers, sortKey, descending]);

  const setSort = (key: SortKey) => {
    if (sortKey === key) setDescending((value) => !value);
    else {
      setSortKey(key);
      setDescending(key !== "rank" && key !== "name" && key !== "lastDealAt");
    }
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "rank", label: "Rank" },
    { key: "name", label: "Broker" },
    { key: "dealsSent", label: "Deals sent" },
    { key: "matchedDeals", label: "Matched criteria" },
    { key: "loiDeals", label: "LOI" },
    { key: "underContractDeals", label: "Under contract" },
    { key: "closedDeals", label: "Closed" },
    { key: "lastDealAt", label: "Last deal date" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f8fb]">
      <DeveloperNavigation />
      <main className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mx-auto max-w-[1600px] space-y-5">
          <header className="border-b border-slate-200 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3286C8]">Broker performance</p>
            <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#0A2B4A]">Broker scorecard</h1>
            <p className="mt-2 text-sm text-slate-600">See which brokers send deals that match your acquisition criteria and advance through your deal pipeline.</p>
          </header>
          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-600"><Loader2 className="h-5 w-5 animate-spin" />Loading broker scorecard</div>
          ) : isError ? (
            <Card><CardContent className="p-6 text-sm text-red-700">The broker scorecard could not be loaded. Refresh to try again.</CardContent></Card>
          ) : !sorted.length ? (
            <Card><CardContent className="p-8 text-center text-sm text-slate-600">No broker deals are available for this company yet.</CardContent></Card>
          ) : (
            <>
              <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
                <table className="w-full min-w-[940px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>{columns.map((column) => (
                      <th key={column.key} scope="col" className="whitespace-nowrap px-3 py-3">
                        <button type="button" onClick={() => setSort(column.key)} className="inline-flex items-center gap-1 hover:text-[#2878b9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A90E2]">
                          {column.label}
                          {sortKey === column.key ? (descending ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />) : null}
                        </button>
                      </th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sorted.map((broker) => (
                      <tr key={broker.brokerId} className="text-slate-700">
                        <td className="px-3 py-4 font-semibold text-[#102d4c]">{broker.rank}</td>
                        <td className="px-3 py-4"><span className="font-medium text-[#102d4c]">{broker.name}</span>{broker.brokerage ? <span className="mt-0.5 block text-xs text-slate-500">{broker.brokerage}</span> : null}</td>
                        <td className="px-3 py-4">{broker.dealsSent}</td>
                        <td className="px-3 py-4">{broker.matchedDeals}</td>
                        <td className="px-3 py-4">{broker.loiDeals}</td>
                        <td className="px-3 py-4">{broker.underContractDeals}</td>
                        <td className="px-3 py-4 font-semibold">{broker.closedDeals}</td>
                        <td className="whitespace-nowrap px-3 py-4">{dateLabel(broker.lastDealAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ol className="space-y-3 md:hidden">
                {sorted.map((broker) => (
                  <li key={broker.brokerId}>
                    <Card className="border-slate-200 shadow-sm">
                      <CardContent className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0"><h2 className="break-words font-semibold text-[#102d4c]">{broker.name}</h2>{broker.brokerage ? <p className="text-xs text-slate-500">{broker.brokerage}</p> : null}</div>
                          <span className="shrink-0 rounded-full bg-[#e8f2fb] px-2.5 py-1 text-xs font-semibold text-[#164d78]">Rank {broker.rank}</span>
                        </div>
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                          <div><dt className="text-xs text-slate-500">Deals sent</dt><dd className="font-semibold text-slate-800">{broker.dealsSent}</dd></div>
                          <div><dt className="text-xs text-slate-500">Matched criteria</dt><dd className="font-semibold text-slate-800">{broker.matchedDeals}</dd></div>
                          <div><dt className="text-xs text-slate-500">LOI</dt><dd className="font-semibold text-slate-800">{broker.loiDeals}</dd></div>
                          <div><dt className="text-xs text-slate-500">Under contract</dt><dd className="font-semibold text-slate-800">{broker.underContractDeals}</dd></div>
                          <div><dt className="text-xs text-slate-500">Closed</dt><dd className="font-semibold text-slate-800">{broker.closedDeals}</dd></div>
                          <div><dt className="text-xs text-slate-500">Last deal date</dt><dd className="font-semibold text-slate-800">{dateLabel(broker.lastDealAt)}</dd></div>
                        </dl>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
