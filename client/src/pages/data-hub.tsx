import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/navigation";
import { useAuth, UserRole } from "@/hooks/useAuth";
import { isAnalyticsAuthorized, isPlatformAdminEmail } from "@shared/admin-auth";
import DataHubLihtcYear15 from "@/components/data-hub-lihtc-year15";
import DataHubCountyData from "@/components/data-hub-county-data";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  TrendingUp, 
  MapPin, 
  Users, 
  Building2, 
  DollarSign,
  Download,
  Search,
  BarChart3,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Home,
  Filter,
  Globe,
  CheckCircle,
  Zap,
  ExternalLink,
  List,
  Building
} from "lucide-react";

interface DealInsights {
  totalDeals: number;
  deals: Array<any>;
  returnedCount: number;
  truncated: boolean;
  offset: number;
  limit: number;
  priceMetrics?: { byState: any[] };
  classificationCounts?: { green: number; yellow: number; red: number };
  productTypeCounts?: any[];
}

type LocalSiteCheckStatus =
  | "available"
  | "no_match"
  | "ambiguous"
  | "not_covered"
  | "not_checked"
  | "error";
interface MarketData {
  uniqueMarkets: number;
  markets: any[];
}

interface BrokerAnalytics {
  activeBrokers: number;
  topBrokers: any[];
}

interface ComparablesCache {
  totalComparables: number;
  comparables: any[];
}

interface ApiSource {
  id: string;
  name: string;
  description: string;
  type: string;
  cost: string;
  endpoint: string;
  dataPoints: string[];
  usedIn: string[];
  coverage?: string;
  freshness?: string;
  integrationStatus?: "automatic" | "on_demand" | "limited" | "catalog_only" | "paid_off";
  integrationDetails?: string;
}

interface ApiSourcesData {
  totalSources: number;
  sources: ApiSource[];
  freeApis: number;
  paidApis: number;
  apiUsageStats: Array<{ service: string; calls: number; cost: number }>;
}

type ImportPreview = {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: Array<{ row: number; reason: string }>;
  mappedColumns: Array<string | { sourceColumn: string; targetColumn: string }>;
  sampleRows: Array<{ row: number; values: Record<string, unknown> }>;
  source?: string;
};

type ImportResult = {
  inserted: number;
  updated: number;
  skipped: number;
  invalid: number;
  errors: Array<{ row: number; reason: string }>;
  totalRows: number;
};

function ImportPreviewPanel({
  title,
  preview,
  busy,
  onCommit,
  onCancel,
}: {
  title: string;
  preview: ImportPreview;
  busy: boolean;
  onCommit: () => void;
  onCancel: () => void;
}) {
  const mappings = preview.mappedColumns.map((item) =>
    typeof item === "string" ? item : `${item.sourceColumn} → ${item.targetColumn}`,
  );
  const sampleColumns = Object.keys(preview.sampleRows[0]?.values || {}).slice(0, 7);
  return (
    <Card className="mb-5 border-blue-200">
      <CardHeader>
        <CardTitle>{title} preview</CardTitle>
        <CardDescription>
          {preview.totalRows} rows · {preview.validRows} valid · {preview.invalidRows} invalid
          {preview.source ? ` · Source: ${preview.source}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-1 text-sm font-medium">Mapped columns</p>
          <div className="flex flex-wrap gap-1">
            {mappings.map((mapping) => <Badge key={mapping} variant="outline">{mapping}</Badge>)}
            {!mappings.length && <span className="text-sm text-muted-foreground">No recognized columns</span>}
          </div>
        </div>
        {preview.sampleRows.length > 0 && (
          <div className="table-scroll-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  {sampleColumns.map((column) => <TableHead key={column}>{column}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.sampleRows.map((sample) => (
                  <TableRow key={sample.row}>
                    <TableCell>{sample.row}</TableCell>
                    {sampleColumns.map((column) => (
                      <TableCell key={column} className="max-w-48 truncate">
                        {typeof sample.values[column] === "object"
                          ? JSON.stringify(sample.values[column])
                          : String(sample.values[column] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {preview.errors.length > 0 && (
          <div className="max-h-36 space-y-1 overflow-auto text-sm text-destructive">
            {preview.errors.slice(0, 50).map((error, index) => (
              <p key={`${error.row}-${index}`}>Row {error.row}: {error.reason}</p>
            ))}
            {preview.errors.length > 50 && <p>Showing the first 50 validation errors.</p>}
          </div>
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button onClick={onCommit} disabled={busy || preview.validRows === 0}>
            {busy ? "Importing…" : `Upsert ${preview.validRows} valid rows`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function displaySourceCost(cost: string): string {
  return cost === 'Free (portal viewing; copy fees vary)'
    ? 'Free to view; copies may cost extra'
    : cost;
}

function connectionStatusLabel(status?: ApiSource["integrationStatus"]): string {
  switch (status) {
    case "automatic": return "Automatic";
    case "on_demand": return "On demand";
    case "limited": return "Limited coverage";
    case "paid_off": return "Paid, off by default";
    default: return "Catalog listing only";
  }
}

function connectionStatusVariant(status?: ApiSource["integrationStatus"]): "default" | "secondary" | "outline" {
  if (status === "automatic") return "default";
  if (status === "limited") return "secondary";
  return "outline";
}

function localSiteStatusLabel(status?: LocalSiteCheckStatus): string {
  switch (status) {
    case "available": return "matched";
    case "no_match": return "no match";
    case "ambiguous": return "ambiguous";
    case "not_covered": return "outside coverage";
    case "not_checked": return "not checked";
    case "error": return "lookup failed";
    default: return "not checked";
  }
}

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return false;
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const escape = (value: unknown) => {
    const text = value === null || value === undefined
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };
  const csv = [columns.map(escape).join(","), ...rows.map((row) => columns.map((column) => escape(row[column])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return true;
}

function formatNumber(value: unknown, fractionDigits = 0): string {
  if (value === null || value === undefined || value === '') return '-';
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      })
    : '-';
}

export default function DataHub() {
  const { user, userRole } = useAuth();
  const isInvestmentCompanyProfile = userRole === UserRole.DEVELOPER || userRole === UserRole.PARTNER;
  const canImportDataHub = isAnalyticsAuthorized(user?.email, userRole);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("deals");
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [rentCompSource, setRentCompSource] = useState<"Upload" | "CoStar upload">("Upload");
  const [rentCompImporting, setRentCompImporting] = useState(false);
  const [dealsImporting, setDealsImporting] = useState(false);
  const [dealsImportFile, setDealsImportFile] = useState<File | null>(null);
  const [rentCompImportFile, setRentCompImportFile] = useState<File | null>(null);
  const [dealsPreview, setDealsPreview] = useState<ImportPreview | null>(null);
  const [rentCompPreview, setRentCompPreview] = useState<ImportPreview | null>(null);
  const [dealsImportResult, setDealsImportResult] = useState<ImportResult | null>(null);
  const [rentCompImportResult, setRentCompImportResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();

  const { data: dealInsights, isLoading: dealsLoading, isError: dealsError } = useQuery<DealInsights>({
    queryKey: ["/api/data-hub/deal-insights?offset=0&limit=200"],
  });

  const { data: marketData, isLoading: marketLoading, isError: marketError } = useQuery<MarketData>({
    queryKey: ["/api/data-hub/market-intelligence"],
  });

  const { data: brokerAnalytics, isLoading: brokersLoading, isError: brokersError } = useQuery<BrokerAnalytics>({
    queryKey: ["/api/data-hub/broker-analytics"],
  });

  const { data: comparablesCache, isLoading: comparablesLoading, isError: comparablesError } = useQuery<ComparablesCache>({
    queryKey: ["/api/data-hub/comparables-cache"],
  });

  const { data: apiSources, isLoading: apiSourcesLoading } = useQuery<ApiSourcesData>({
    queryKey: ["/api/data-hub/api-sources"],
    enabled: !isInvestmentCompanyProfile,
  });
  const previewRentComps = async (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File is too large", description: "Choose a file under 10 MB.", variant: "destructive" });
      return;
    }
    const form = new FormData();
    form.append("file", file);
    form.append("source", rentCompSource);
    setRentCompImporting(true);
    try {
      const response = await fetch("/api/data-hub/rent-comps/import/preview", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not preview rent comps.");
      setRentCompImportFile(file);
      setRentCompPreview(result);
      setRentCompImportResult(null);
    } catch (error: any) {
      toast({ title: "Preview failed", description: error.message, variant: "destructive" });
    } finally {
      setRentCompImporting(false);
    }
  };
  const commitRentComps = async () => {
    if (!rentCompImportFile) return;
    const form = new FormData();
    form.append("file", rentCompImportFile);
    form.append("source", rentCompPreview?.source || rentCompSource);
    setRentCompImporting(true);
    try {
      const response = await fetch("/api/data-hub/rent-comps/import", { method: "POST", credentials: "include", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not import rent comps.");
      setRentCompImportResult(result);
      setRentCompPreview(null);
      setRentCompImportFile(null);
      toast({ title: "Rent comps upsert complete", description: `${result.inserted} inserted, ${result.updated} updated, ${result.skipped} skipped, ${result.invalid} invalid.` });
      await queryClient.invalidateQueries({ queryKey: ["/api/data-hub/comparables-cache"] });
    } catch (error: any) {
      toast({ title: "Import failed", description: error.message, variant: "destructive" });
    } finally {
      setRentCompImporting(false);
    }
  };
  const previewDealsCsv = async (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File is too large", description: "Choose a file under 10 MB.", variant: "destructive" });
      return;
    }
    const form = new FormData();
    form.append("file", file);
    setDealsImporting(true);
    try {
      const response = await fetch("/api/data-hub/deals/import/preview", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not preview deals.");
      setDealsImportFile(file);
      setDealsPreview(result);
      setDealsImportResult(null);
    } catch (error: any) {
      toast({ title: "Preview failed", description: error.message, variant: "destructive" });
    } finally {
      setDealsImporting(false);
    }
  };
  const commitDealsCsv = async () => {
    if (!dealsImportFile) return;
    const form = new FormData();
    form.append("file", dealsImportFile);
    setDealsImporting(true);
    try {
      const response = await fetch("/api/data-hub/deals/import", { method: "POST", credentials: "include", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not import deals.");
      setDealsImportResult(result);
      setDealsPreview(null);
      setDealsImportFile(null);
      toast({ title: "Deals upsert complete", description: `${result.inserted} inserted, ${result.updated} updated, ${result.skipped} skipped, ${result.invalid} invalid.` });
      await queryClient.invalidateQueries({ queryKey: ["/api/data-hub/deal-insights?offset=0&limit=200"] });
    } catch (error: any) {
      toast({ title: "Deals import failed", description: error.message, variant: "destructive" });
    } finally {
      setDealsImporting(false);
    }
  };
  const exportRows = (filename: string, rows: Record<string, unknown>[] | undefined) => {
    if (!downloadCsv(filename, rows || [])) {
      toast({ title: "No data available to export", variant: "destructive" });
    }
  };

  const exportDeals = async () => {
    try {
      const rows: Record<string, unknown>[] = [];
      let offset = 0;
      let truncated = true;
      while (truncated) {
        const response = await fetch(`/api/data-hub/deal-insights?offset=${offset}&limit=500`, { credentials: "include" });
        const page = await response.json();
        if (!response.ok) throw new Error(page.error || "Could not export deals");
        rows.push(...(page.deals || []));
        offset += page.returnedCount || 0;
        truncated = Boolean(page.truncated) && page.returnedCount > 0;
      }
      exportRows("deallinq-deals.csv", rows);
    } catch (error: any) {
      toast({ title: "Export failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Data Hub - Proprietary Intelligence | DealLinq</title>
        <meta name="description" content="Access proprietary deal data, market intelligence, broker analytics, and comparable properties for informed development decisions." />
      </Helmet>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pt-20 pb-16 px-4">
        <div className="max-w-[1800px] mx-auto">
          <header className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-[#4A90E2]" />
              <h1 className="text-3xl md:text-4xl font-bold text-[#07172A] tracking-tight">
                Data Hub
              </h1>
              </div>
              {canImportDataHub && (
                <label className={`inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium hover:bg-slate-50 ${dealsImporting ? "pointer-events-none opacity-60" : ""}`}>
                  <FileSpreadsheet className="h-4 w-4" />
                  {dealsImporting ? "Preparing deals…" : "Import deals CSV / Excel"}
                  <input
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    className="sr-only"
                    disabled={dealsImporting}
                    onChange={(event) => {
                      void previewDealsCsv(event.target.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
              )}
            </div>
            <p className="text-base md:text-lg text-gray-600">
              Proprietary intelligence from your deals, markets, and broker network
            </p>
          </header>
          {dealsImportResult && (
            <Card className="mb-6" aria-live="polite">
              <CardHeader>
                <CardTitle>Deals import results</CardTitle>
                <CardDescription>{dealsImportResult.inserted} inserted · {dealsImportResult.updated} updated · {dealsImportResult.skipped} skipped · {dealsImportResult.invalid} invalid · {dealsImportResult.totalRows} total rows</CardDescription>
              </CardHeader>
              {dealsImportResult.errors.length > 0 && (
                <CardContent>
                  <ul className="max-h-56 space-y-1 overflow-auto text-sm text-destructive">
                    {dealsImportResult.errors.map((error, index) => (
                      <li key={`${error.row}-${index}`}>Row {error.row}: {error.reason}</li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          )}
          {dealsPreview && (
            <ImportPreviewPanel
              title="Deals"
              preview={dealsPreview}
              busy={dealsImporting}
              onCommit={() => void commitDealsCsv()}
              onCancel={() => { setDealsPreview(null); setDealsImportFile(null); }}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Deals Analyzed</p>
                    <p className="text-2xl font-bold text-[#07172A]">
                      {dealsError
                        ? <span className="text-sm text-destructive">Unavailable</span>
                        : dealInsights?.totalDeals ?? 0}
                    </p>
                  </div>
                  <Building2 className="h-10 w-10 text-[#4A90E2] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Markets Covered</p>
                    <p className="text-2xl font-bold text-[#07172A]">
                      {marketError
                        ? <span className="text-sm text-destructive">Unavailable</span>
                        : marketData?.uniqueMarkets ?? 0}
                    </p>
                  </div>
                  <MapPin className="h-10 w-10 text-green-500 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Brokers</p>
                    <p className="text-2xl font-bold text-[#07172A]">
                      {brokersError
                        ? <span className="text-sm text-destructive">Unavailable</span>
                        : brokerAnalytics?.activeBrokers ?? 0}
                    </p>
                  </div>
                  <Users className="h-10 w-10 text-purple-500 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Comparables Cached</p>
                    <p className="text-2xl font-bold text-[#07172A]">
                      {comparablesError
                        ? <span className="text-sm text-destructive">Unavailable</span>
                        : comparablesCache?.totalComparables ?? 0}
                    </p>
                  </div>
                  <Home className="h-10 w-10 text-orange-500 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className={`grid ${isInvestmentCompanyProfile ? "grid-cols-4 max-w-2xl" : "grid-cols-6 max-w-4xl"} w-full`}>
              <TabsTrigger value="deals" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Deal History</span>
              </TabsTrigger>
              <TabsTrigger value="markets" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Markets</span>
              </TabsTrigger>
              <TabsTrigger value="brokers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Brokers</span>
              </TabsTrigger>
              <TabsTrigger value="comparables" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Comparables</span>
              </TabsTrigger>
              {isPlatformAdminEmail(user?.email) && (
                <TabsTrigger value="county-data" className="flex items-center gap-2" data-testid="tab-county-data">
                  <MapPin className="h-4 w-4" />
                  <span>County data</span>
                </TabsTrigger>
              )}
              {!isInvestmentCompanyProfile && (
                <>
                  <TabsTrigger value="apis" className="flex items-center gap-2" data-testid="tab-api-sources">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">API Sources</span>
                  </TabsTrigger>
                </>
              )}
              {!isInvestmentCompanyProfile && (
                <TabsTrigger value="export" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="deals">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Deal Intelligence</CardTitle>
                      <CardDescription>Historical deals with pricing, acreage, and classification data</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Search deals..." 
                        className="w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        data-testid="input-search-deals"
                      />
                      <Select value={stateFilter} onValueChange={setStateFilter}>
                        <SelectTrigger className="w-32" data-testid="select-state-filter">
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All States</SelectItem>
                          <SelectItem value="NC">North Carolina</SelectItem>
                          <SelectItem value="SC">South Carolina</SelectItem>
                          <SelectItem value="GA">Georgia</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {dealsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : dealInsights?.deals?.length > 0 ? (
                    <div>
                      <p className="mb-3 text-sm text-gray-500">
                        Showing {dealInsights.returnedCount} of {dealInsights.totalDeals} deals.
                        {dealInsights.truncated ? " Narrow the filters to focus the table, or export all deals as CSV." : ""}
                      </p>
                      <div className="table-scroll-container">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Property</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Product Type</TableHead>
                            <TableHead className="text-right">Acreage</TableHead>
                            <TableHead>Wake/Raleigh site checks</TableHead>
                            <TableHead className="text-right">Price/Acre</TableHead>
                            <TableHead className="text-right">Units</TableHead>
                            <TableHead>Classification</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dealInsights.deals
                            .filter((deal: any) => {
                              if (stateFilter !== "all" && deal.state !== stateFilter) return false;
                              if (searchQuery && !deal.propertyName?.toLowerCase().includes(searchQuery.toLowerCase()) && 
                                  !deal.city?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                              return true;
                            })
                            .slice(0, 50)
                            .map((deal: any) => (
                            <TableRow key={deal.id} data-testid={`row-deal-${deal.id}`}>
                              <TableCell className="font-medium">{deal.propertyName || 'Unnamed'}</TableCell>
                              <TableCell>{deal.city}, {deal.state}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{deal.productType || 'N/A'}</Badge>
                              </TableCell>
                              <TableCell className="text-right">{formatNumber(deal.acreage, 2)}</TableCell>
                              <TableCell>
                                {(() => {
                                  const local = deal.localSiteData as DataHubLocalSiteData | null | undefined;
                                  const parcel = local?.parcel;
                                  const zoning = local?.zoning;
                                  const parcelValue = parcel?.status === "available"
                                    ? `${parcel.parcelId || "matched"}${parcel.acreage == null ? "" : ` · ${formatNumber(parcel.acreage, 3)} ac`}`
                                    : localSiteStatusLabel(parcel?.status);
                                  const zoningValue = zoning?.status === "available"
                                    ? zoning.districts?.map((district) =>
                                        district.effectiveDate
                                          ? `${district.code} (${district.effectiveDate})`
                                          : district.code,
                                      ).join(", ") || "no district returned"
                                    : localSiteStatusLabel(zoning?.status);
                                  const sourceMessages = [
                                    parcel?.message,
                                    zoning?.message,
                                    local?.utilities?.message,
                                  ].filter(Boolean).join(" ");
                                  return (
                                    <div
                                      className="min-w-56 space-y-0.5 text-xs"
                                      title={sourceMessages || "Local parcel and zoning sources have not been checked."}
                                    >
                                      <div><span className="font-medium">Parcel:</span> {parcelValue}</div>
                                      <div><span className="font-medium">Zoning:</span> {zoningValue}</div>
                                      <div><span className="font-medium">Utilities:</span> unknown</div>
                                      <div className="text-[10px] text-gray-500">
                                        Checked {local?.checkedAt ? new Date(local.checkedAt).toLocaleDateString() : "not checked"}
                                      </div>
                                    </div>
                                  );
                                })()}
                              </TableCell>
                              <TableCell className="text-right">
                                {deal.pricePerAcre ? `$${formatNumber(deal.pricePerAcre)}` : '-'}
                              </TableCell>
                              <TableCell className="text-right">{deal.proposedUnits || '-'}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={deal.classification === 'green' ? 'default' : deal.classification === 'yellow' ? 'secondary' : 'destructive'}
                                >
                                  {deal.classification || 'pending'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-500">
                                {deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No deal data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {dealInsights?.priceMetrics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Avg Price/Acre by State</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dealInsights.priceMetrics.byState?.slice(0, 5).map((item: any) => (
                          <div key={item.state} className="flex justify-between items-center">
                            <span className="font-medium">{item.state}</span>
                            <span className="text-[#4A90E2]">${formatNumber(item.avgPricePerAcre)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Classification Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            Pursuing (Green)
                          </span>
                          <span className="font-bold">{dealInsights.classificationCounts?.green || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            Reviewing (Yellow)
                          </span>
                          <span className="font-bold">{dealInsights.classificationCounts?.yellow || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            Passed (Red)
                          </span>
                          <span className="font-bold">{dealInsights.classificationCounts?.red || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Top Product Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dealInsights.productTypeCounts?.slice(0, 5).map((item: any) => (
                          <div key={item.type} className="flex justify-between items-center">
                            <span>{item.type}</span>
                            <Badge variant="outline">{item.count} deals</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="markets">
              <Card>
                <CardHeader>
                  <CardTitle>Market Intelligence</CardTitle>
                  <CardDescription>Deal activity and pricing trends by market</CardDescription>
                </CardHeader>
                <CardContent>
                  {marketLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : marketData?.markets?.length > 0 ? (
                    <div className="table-scroll-container">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Market (City, State)</TableHead>
                            <TableHead className="text-right">Total Deals</TableHead>
                            <TableHead className="text-right">Green Deals</TableHead>
                            <TableHead className="text-right">Avg Price/Acre</TableHead>
                            <TableHead className="text-right">Avg Units</TableHead>
                            <TableHead>Win Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {marketData.markets.map((market: any) => (
                            <TableRow key={`${market.city}-${market.state}`}>
                              <TableCell className="font-medium">{market.city}, {market.state}</TableCell>
                              <TableCell className="text-right">{market.dealCount}</TableCell>
                              <TableCell className="text-right text-green-600">{market.greenCount}</TableCell>
                              <TableCell className="text-right">
                                {market.avgPricePerAcre ? `$${formatNumber(market.avgPricePerAcre)}` : '-'}
                              </TableCell>
                              <TableCell className="text-right">{formatNumber(market.avgUnits)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={market.winRate || 0} className="h-2 w-20" />
                                  <span className="text-sm">{formatNumber(market.winRate) === '-' ? '0' : formatNumber(market.winRate)}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No market data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="brokers">
              <Card>
                <CardHeader>
                  <CardTitle>Broker Network Analytics</CardTitle>
                  <CardDescription>Deal sources and broker engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {brokersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : brokerAnalytics?.topBrokers?.length > 0 ? (
                    <div className="table-scroll-container">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Broker</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead className="text-right">Total Deals</TableHead>
                            <TableHead className="text-right">Green Deals</TableHead>
                            <TableHead>Success Rate</TableHead>
                            <TableHead>Markets</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {brokerAnalytics.topBrokers.map((broker: any) => (
                            <TableRow key={broker.id}>
                              <TableCell className="font-medium">{broker.name || broker.email}</TableCell>
                              <TableCell>{broker.company || '-'}</TableCell>
                              <TableCell className="text-right">{broker.dealCount}</TableCell>
                              <TableCell className="text-right text-green-600">{broker.greenCount}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={broker.successRate || 0} className="h-2 w-20" />
                                  <span className="text-sm">{formatNumber(broker.successRate) === '-' ? '0' : formatNumber(broker.successRate)}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {broker.markets?.slice(0, 3).map((m: string) => (
                                    <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
                                  ))}
                                  {broker.markets?.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">+{broker.markets.length - 3}</Badge>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No broker analytics available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparables">
              {isPlatformAdminEmail(user?.email) && (
                <DataHubLihtcYear15
                  canImport={canImportDataHub}
                  canSync={isPlatformAdminEmail(user?.email)}
                />
              )}
              <Card>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Cached Comparables</CardTitle>
                    <CardDescription>Deal, upload, CoStar, and cached market comparables. Older records are labeled.</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    {canImportDataHub && <select
                      aria-label="Rent comp import source"
                      value={rentCompSource}
                      disabled={Boolean(rentCompPreview) || rentCompImporting}
                      onChange={(event) => setRentCompSource(event.target.value as "Upload" | "CoStar upload")}
                      className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
                    >
                      <option value="Upload">Upload</option>
                      <option value="CoStar upload">CoStar monthly upload</option>
                    </select>}
                    {canImportDataHub && <label className={`inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-medium hover:bg-slate-50 ${rentCompImporting ? "pointer-events-none opacity-60" : ""}`}>
                      <FileSpreadsheet className="h-4 w-4" />
                      {rentCompImporting ? "Preparing…" : "Import CSV / Excel"}
                      <input
                        type="file"
                        accept=".csv,.xls,.xlsx"
                        className="sr-only"
                        disabled={rentCompImporting}
                        onChange={(event) => {
                          void previewRentComps(event.target.files?.[0]);
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>}
                  </div>
                </CardHeader>
                {rentCompPreview && (
                  <CardContent className="pt-0">
                    <ImportPreviewPanel
                      title="Rent comps"
                      preview={rentCompPreview}
                      busy={rentCompImporting}
                      onCommit={() => void commitRentComps()}
                      onCancel={() => { setRentCompPreview(null); setRentCompImportFile(null); }}
                    />
                  </CardContent>
                )}
                {rentCompImportResult && (
                  <CardContent className="pt-0">
                    <div className="rounded-md border p-3 text-sm" aria-live="polite">
                      Rent comps: {rentCompImportResult.inserted} inserted · {rentCompImportResult.updated} updated · {rentCompImportResult.skipped} skipped · {rentCompImportResult.invalid} invalid.
                      {rentCompImportResult.errors.length > 0 && (
                        <div className="mt-2 max-h-32 space-y-1 overflow-auto text-destructive">
                          {rentCompImportResult.errors.slice(0, 50).map((error, index) => (
                            <p key={`${error.row}-${index}`}>Row {error.row}: {error.reason}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
                <CardContent>
                  {comparablesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : comparablesCache?.comparables?.length > 0 ? (
                    <div className="table-scroll-container">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Property Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Units</TableHead>
                            <TableHead className="text-right">Year Built</TableHead>
                            <TableHead className="text-right">Rent PSF</TableHead>
                            <TableHead>Bedroom Rent PSF</TableHead>
                            <TableHead className="text-right">Occupancy</TableHead>
                            <TableHead className="text-right">Distance (mi)</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Freshness</TableHead>
                            <TableHead>Source Deal</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {comparablesCache.comparables.slice(0, 100).map((comp: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{comp.propertyName}</TableCell>
                              <TableCell>{comp.city}, {comp.state}</TableCell>
                              <TableCell className="text-right">{comp.units}</TableCell>
                              <TableCell className="text-right">{comp.yearBuilt}</TableCell>
                              <TableCell className="text-right">
                                {comp.rentPsf ? `$${formatNumber(comp.rentPsf, 2)}` : '-'}
                              </TableCell>
                              <TableCell className="text-xs">
                                {Object.entries(comp.rentPsfByBedroom || {}).length
                                  ? Object.entries(comp.rentPsfByBedroom).map(([bedroom, rent]) => `${bedroom}: $${formatNumber(rent, 2)}`).join(" · ")
                                  : "-"}
                              </TableCell>
                              <TableCell className="text-right">{comp.occupancyPct === null ? "-" : `${formatNumber(comp.occupancyPct, 1)}%`}</TableCell>
                              <TableCell className="text-right">{formatNumber(comp.distance, 1)}</TableCell>
                              <TableCell>{comp.source || "-"}</TableCell>
                              <TableCell>{comp.olderThan3Months ? <Badge variant="outline">Older than 3 months</Badge> : "Recent"}</TableCell>
                              <TableCell className="text-gray-500 text-sm">{comp.sourceDeal || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No cached comparables available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {isPlatformAdminEmail(user?.email) && (
              <TabsContent value="county-data">
                <DataHubCountyData />
              </TabsContent>
            )}

            {!isInvestmentCompanyProfile && <TabsContent value="apis">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Data API Sources
                      </CardTitle>
                      <CardDescription>
                        Sources include live connections, on-demand lookups, and catalog references. Check each connection status.
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {apiSources?.freeApis || 0} free sources
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        <Zap className="h-3 w-3 mr-1" />
                        {apiSources?.paidApis || 0} paid / usage-based
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {apiSourcesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : apiSources?.sources?.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {apiSources.sources.map((source) => (
                        <Card key={source.id} className="border-2" data-testid={`api-source-${source.id}`}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{source.name}</CardTitle>
                              <Badge variant={source.cost.toLowerCase().startsWith('free') ? 'default' : 'secondary'}>
                                {displaySourceCost(source.cost)}
                              </Badge>
                            </div>
                            <CardDescription>{source.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="rounded-md bg-slate-50 p-3">
                              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs font-medium text-gray-600">App connection</p>
                                <Badge variant={connectionStatusVariant(source.integrationStatus)}>
                                  {connectionStatusLabel(source.integrationStatus)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700">
                                {source.integrationDetails || "Connection status has not been verified."}
                              </p>
                            </div>
                            {source.coverage && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Coverage</p>
                                <p className="text-sm text-gray-700">{source.coverage}</p>
                              </div>
                            )}
                            {source.freshness && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Freshness / limitations</p>
                                <p className="text-sm text-gray-700">{source.freshness}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Type</p>
                              <Badge variant="outline">{source.type}</Badge>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Data Points</p>
                              <div className="flex flex-wrap gap-1">
                                {source.dataPoints.map((point, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {point}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Used In</p>
                              <div className="flex flex-wrap gap-1">
                                {source.usedIn.map((use, idx) => (
                                  <span key={idx} className="text-xs text-blue-600">
                                    {use}{idx < source.usedIn.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Endpoint</p>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                                {source.endpoint}
                              </code>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No API sources found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>}

            {!isInvestmentCompanyProfile && <TabsContent value="export">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5" />
                      Export Deal Data
                    </CardTitle>
                    <CardDescription>Download comprehensive deal history with all metadata</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Export includes: Property details, pricing, acreage, classifications, broker info, and analysis results
                    </p>
                    <Button className="w-full" data-testid="button-export-deals" onClick={exportDeals}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Deals to CSV
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Export Market Analysis
                    </CardTitle>
                    <CardDescription>Market-level aggregations and trends</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Export includes: Market summaries, pricing trends, deal volume, and success rates by geography
                    </p>
                    <Button className="w-full" variant="outline" data-testid="button-export-markets" onClick={() => exportRows("deallinq-markets.csv", marketData?.markets)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Market Data
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Export Broker Analytics
                    </CardTitle>
                    <CardDescription>Broker performance and engagement metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Export includes: Broker profiles, deal counts, success rates, and market coverage
                    </p>
                    <Button className="w-full" variant="outline" data-testid="button-export-brokers" onClick={() => exportRows("deallinq-brokers.csv", brokerAnalytics?.topBrokers)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Broker Data
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Export Comparables
                    </CardTitle>
                    <CardDescription>All cached property comparables</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Export includes: Property names, locations, units, year built, rent PSF, and distance data
                    </p>
                    <Button className="w-full" variant="outline" data-testid="button-export-comparables" onClick={() => exportRows("deallinq-comparables.csv", comparablesCache?.comparables)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Comparables
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>}


          </Tabs>
        </div>
      </div>
    </>
  );
}

type DataHubLocalSiteData = {
  checkedAt?: string;
  parcel?: {
    status: LocalSiteCheckStatus;
    message?: string;
    parcelId?: string | null;
    acreage?: number | null;
    siteAddress?: string | null;
  };
  zoning?: {
    status: LocalSiteCheckStatus;
    message?: string;
    districts?: Array<{ code: string; effectiveDate?: string | null }>;
  };
  utilities?: { status: "unknown"; message?: string };
};
