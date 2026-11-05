import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import AcquisitionUnderwritingPanel from "@/components/AcquisitionUnderwritingPanel";
import { Card, CardContent } from "@/components/ui/card";

type DeveloperDeal = {
  id: string;
  propertyName?: string | null;
  address: string;
  city?: string | null;
  county?: string | null;
  state?: string | null;
  zip?: string | null;
  askingPrice?: string | null;
  unitCount?: number | null;
  vintage?: number | null;
  dealType?: string | null;
  calculatedFields?: Record<string, any> | null;
};

export default function DeveloperDealDetails() {
  const { id } = useParams<{ id: string }>();
  const dealQuery = useQuery<DeveloperDeal>({
    queryKey: ["/api/deals", id, "full"],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await fetch(`/api/deals/${encodeURIComponent(id!)}/full`, {
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "Unable to load this deal");
      return payload;
    },
  });
  const deal = dealQuery.data;
  const isAcquisition = deal?.dealType === "existing_multifamily"
    || Boolean(deal?.calculatedFields?.acquisition);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/developer/dashboard" className="inline-flex min-h-11 items-center text-sm font-medium text-blue-800 hover:underline">
          Back to deal dashboard
        </Link>

        {dealQuery.isLoading ? (
          <Card><CardContent className="p-6 text-sm text-slate-600">Loading deal…</CardContent></Card>
        ) : dealQuery.isError || !deal ? (
          <Card>
            <CardContent className="space-y-3 p-6">
              <h1 className="text-lg font-semibold text-slate-900">Deal unavailable</h1>
              <p className="text-sm text-slate-600">This deal could not be found or is not available to your company.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-slate-500">Investment opportunity</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-950">
                {deal.propertyName || deal.address}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {[deal.address, deal.city, deal.state, deal.zip].filter(Boolean).join(", ")}
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-slate-500">County</dt>
                  <dd className="mt-1 font-medium text-slate-900">{deal.county || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Units</dt>
                  <dd className="mt-1 font-medium text-slate-900">{deal.unitCount?.toLocaleString() || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Year built</dt>
                  <dd className="mt-1 font-medium text-slate-900">{deal.vintage || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Asking price</dt>
                  <dd className="mt-1 font-medium text-slate-900">
                    {deal.askingPrice
                      ? Number(deal.askingPrice).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
                      : "Not provided"}
                  </dd>
                </div>
              </dl>
            </section>
            {isAcquisition && <AcquisitionUnderwritingPanel dealId={deal.id} canEdit={true} />}
          </>
        )}
      </div>
    </main>
  );
}
