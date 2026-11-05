import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, FileUp, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type DetectedColumn = { index: number; header: string; matches?: string[] };
type AcquisitionResponse = {
  acquisition?: Record<string, any> | null;
  classifications?: Array<{ classification?: string; reasons?: string[]; developerProfileId?: string }>;
};

const uploadKinds = [
  { kind: "rent_roll", label: "Rent roll" },
  { kind: "t12", label: "T12" },
  { kind: "tn", label: "Trailing T-n" },
] as const;

const mappingFields = [
  ["unit", "Unit"],
  ["sf", "SF"],
  ["status", "Status"],
  ["marketRent", "Market rent"],
  ["inPlaceRent", "In-place rent"],
  ["transCode", "Trans code"],
  ["chargeAmount", "Charge amount"],
] as const;

async function requestJson(url: string, init?: RequestInit) {
  const response = await fetch(url, { credentials: "include", ...init });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

function money(value: unknown) {
  const number = Number(value);
  return value === null || value === undefined || value === "" || !Number.isFinite(number)
    ? "Not available"
    : number.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function percent(value: unknown) {
  const number = Number(value);
  return value === null || value === undefined || value === "" || !Number.isFinite(number)
    ? "Not available"
    : `${number.toFixed(2)}%`;
}

function numericInput(value: unknown) {
  return value === null || value === undefined ? "" : String(value);
}

function classificationStyle(value: string) {
  switch (value.toLowerCase()) {
    case "green": return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "yellow": return "border-amber-200 bg-amber-50 text-amber-800";
    case "red": return "border-red-200 bg-red-50 text-red-800";
    default: return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export default function AcquisitionUnderwritingPanel({
  dealId,
  canEdit,
}: {
  dealId: string;
  canEdit: boolean;
}) {
  const queryClient = useQueryClient();
  const queryKey = [`/api/deals/${dealId}/acquisition`];
  const [assumptions, setAssumptions] = useState<Record<string, string | boolean>>({});
  const [capexMode, setCapexMode] = useState<"total" | "perUnit">("total");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [detectedColumns, setDetectedColumns] = useState<DetectedColumn[]>([]);
  const [mappingFile, setMappingFile] = useState<{ kind: string; fileName: string; fileBase64: string } | null>(null);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});

  const acquisitionQuery = useQuery<AcquisitionResponse>({
    queryKey,
    queryFn: () => requestJson(`/api/deals/${dealId}/acquisition`),
    enabled: Boolean(dealId),
  });
  const acquisition = acquisitionQuery.data?.acquisition || {};
  const result = acquisition.result || null;
  const assumptionsMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => requestJson(`/api/deals/${dealId}/acquisition-assumptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: [`/api/deals/${dealId}/full`] }),
        queryClient.invalidateQueries({ queryKey: ["/api/deals"] }),
      ]);
    },
  });
  const uploadMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => requestJson(`/api/deals/${dealId}/acquisition-docs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
    onSuccess: async (response, variables) => {
      if (variables.kind === "rent_roll") {
        setDetectedColumns(response.detectedColumns || response.acquisition?.rentRoll?.detectedColumns || []);
      }
      if (response.needsMapping) {
        setUploadMessage("Choose the rent-roll columns, then resubmit the same file.");
      } else {
        setMappingFile(null);
        setColumnMapping({});
        setUploadMessage("Document uploaded and processed.");
      }
      setUploadError("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: [`/api/deals/${dealId}/full`] }),
        queryClient.invalidateQueries({ queryKey: ["/api/deals"] }),
      ]);
    },
    onError: (error: Error) => setUploadError(error.message),
  });

  useEffect(() => {
    const stored = acquisition.assumptions || {};
    setAssumptions({
      closingCostPct: numericInput(stored.closingCostPct ?? 2),
      capexTotal: numericInput(stored.capexTotal),
      capexPerUnit: numericInput(stored.capexPerUnit),
      mgmtFeePct: numericInput(stored.mgmtFeePct ?? 3),
      useTnForYoc: stored.useTnForYoc === true,
      proFormaAvgRentPerUnit: numericInput(stored.proFormaAvgRentPerUnit),
      proFormaVacancyPct: numericInput(stored.proFormaVacancyPct ?? 5),
      proFormaOpexPerUnit: numericInput(stored.proFormaOpexPerUnit),
      proFormaOtherIncomePerUnitMonthly: numericInput(stored.proFormaOtherIncomePerUnitMonthly ?? 0),
    });
    setCapexMode(stored.capexPerUnit !== undefined && stored.capexTotal === undefined ? "perUnit" : "total");
    if (Array.isArray(acquisition.rentRoll?.detectedColumns)) {
      setDetectedColumns(acquisition.rentRoll.detectedColumns);
    }
  }, [acquisition.assumptions]);

  const classifications = acquisitionQuery.data?.classifications || [];
  const rentRoll = acquisition.rentRoll || {};
  const t12 = acquisition.t12 || {};
  const tn = acquisition.tn || {};
  const selectedStatement = assumptions.useTnForYoc === true ? tn : t12;
  const allInNoi = result
    ? result.allInYocNoiBasis === "adjustedNoi"
      ? result.adjustedNoi
      : selectedStatement.annualized?.noi
    : null;
  const missingInputs = acquisition.missing?.length
    ? acquisition.missing
    : ["Purchase price", "unit count", assumptions.useTnForYoc ? "T-n NOI" : "T12 NOI"];
  const mappingPayload = useMemo(() => Object.fromEntries(
    Object.entries(columnMapping).filter(([, value]) => value !== "").map(([key, value]) => [key, Number(value)]),
  ), [columnMapping]);

  const updateAssumption = (key: string, value: string | boolean) =>
    setAssumptions((current) => ({ ...current, [key]: value }));

  async function handleUpload(kind: string, file?: File) {
    if (!file) return;
    setUploadError("");
    setUploadMessage("");
    setMappingFile(null);
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("Choose a file smaller than 15 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setUploadError("Could not read this file.");
    reader.onload = () => {
      const fileBase64 = String(reader.result || "");
      const pending = { kind, fileName: file.name, fileBase64 };
      setMappingFile(pending);
      uploadMutation.mutate(pending);
    };
    reader.readAsDataURL(file);
  }

  function saveAssumptions() {
    const numericKeys = [
      "closingCostPct", "mgmtFeePct", "proFormaAvgRentPerUnit",
      "proFormaVacancyPct", "proFormaOpexPerUnit", "proFormaOtherIncomePerUnitMonthly",
    ];
    const payload: Record<string, unknown> = { useTnForYoc: assumptions.useTnForYoc === true };
    for (const key of numericKeys) {
      const value = assumptions[key];
      if (value !== "" && value !== undefined) payload[key] = Number(value);
    }
    const capexKey = capexMode === "total" ? "capexTotal" : "capexPerUnit";
    const capexValue = assumptions[capexKey];
    if (capexValue !== "" && capexValue !== undefined) payload[capexKey] = Number(capexValue);
    assumptionsMutation.mutate(payload);
  }

  return (
    <div className="space-y-5" data-testid="acquisition-underwriting-panel">
      <Card data-testid="card-acquisition-yoc">
        <CardHeader><CardTitle>Acquisition yield on cost</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          {acquisitionQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading underwriting…</div>
          ) : acquisitionQuery.isError ? (
            <p className="text-sm text-red-700">Acquisition underwriting could not be loaded.</p>
          ) : result ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {[
                  ["Going-in cap", percent(result.goingInCapRate)],
                  ["Adjusted going-in cap", percent(result.adjustedGoingInCap)],
                  [`T${tn.months || "n"} annualized cap`, percent(result.tnGoingInCap)],
                  ["All-in YOC", percent(result.allInYoc)],
                  ...(result.stabilizedYoc !== null ? [["Stabilized YOC", percent(result.stabilizedYoc)]] : []),
                  ["Price / unit", money(result.pricePerUnit)],
                  ["Price / SF", money(result.pricePerSf)],
                  ["All-in basis", money(result.allInBasis)],
                  ["NOI used", money(allInNoi)],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 break-words font-semibold text-[#0A2B4A]">{value}</p>
                  </div>
                ))}
              </div>
              {(result.notes || []).some((note: string) => note.toLowerCase().includes("management fee")) && (
                <p className="text-xs text-slate-500">Adjusted going-in cap adds a {percent(acquisition.assumptions?.mgmtFeePct ?? 3)} management fee because the T12 has no management line.</p>
              )}
            </>
          ) : (
            <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>YOC is not calculated yet. Missing inputs: {(missingInputs || []).join(", ")}.</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {[
              ["Occupancy", percent(rentRoll.occupancyPct)],
              ["Avg in-place rent", money(rentRoll.avgInPlaceRent)],
              ["Avg market rent", money(rentRoll.avgMarketRent)],
              ["Units", rentRoll.units ?? "Not available"],
              ["T12 income", money(t12.totalIncome)],
              ["T12 operating expenses", money(t12.totalOpex)],
              ["T12 NOI", money(t12.annualized?.noi ?? t12.noi)],
            ].map(([label, value]) => <div key={label}><p className="text-xs text-slate-500">{label}</p><p className="font-medium text-slate-800">{value}</p></div>)}
          </div>
        </CardContent>
      </Card>

      <Card data-testid="acquisition-flags">
        <CardHeader><CardTitle>Acquisition flags</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {classifications.length ? classifications.map((item, index) => (
            <div key={`${item.developerProfileId || "company"}-${index}`} className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <Badge className={classificationStyle(item.classification || "review")}>{item.classification || "Unclassified"}</Badge>
              <ul className="list-inside list-disc text-sm text-slate-600">
                {(item.reasons || []).length ? item.reasons!.map((reason, reasonIndex) => <li key={reasonIndex}>{reason}</li>) : <li>No classification reasons recorded.</li>}
              </ul>
            </div>
          )) : <p className="text-sm text-slate-500">No acquisition classification is available.</p>}
        </CardContent>
      </Card>

      {canEdit && (
        <>
          <Card>
            <CardHeader><CardTitle>Underwriting assumptions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><Label>Closing cost %</Label><Input className="mt-1" type="number" min="0" step="0.1" value={assumptions.closingCostPct as string || ""} onChange={(event) => updateAssumption("closingCostPct", event.target.value)} /></div>
                <div className="flex items-end gap-2">
                  <div className="min-w-0 flex-1"><Label>Capex {capexMode === "total" ? "total" : "per unit"}</Label><Input className="mt-1" type="number" min="0" step="1" value={(assumptions[capexMode === "total" ? "capexTotal" : "capexPerUnit"] as string) || ""} onChange={(event) => updateAssumption(capexMode === "total" ? "capexTotal" : "capexPerUnit", event.target.value)} /></div>
                  <Button type="button" variant="outline" className="mb-0.5 shrink-0" onClick={() => setCapexMode(capexMode === "total" ? "perUnit" : "total")}>{capexMode === "total" ? "Use per unit" : "Use total"}</Button>
                </div>
                <div><Label>Management fee %</Label><Input className="mt-1" type="number" min="0" step="0.1" value={assumptions.mgmtFeePct as string || ""} onChange={(event) => updateAssumption("mgmtFeePct", event.target.value)} /></div>
                <div><Label>Pro forma average rent / unit</Label><Input className="mt-1" type="number" min="0" step="1" value={assumptions.proFormaAvgRentPerUnit as string || ""} onChange={(event) => updateAssumption("proFormaAvgRentPerUnit", event.target.value)} /></div>
                <div><Label>Vacancy %</Label><Input className="mt-1" type="number" min="0" max="100" step="0.1" value={assumptions.proFormaVacancyPct as string || ""} onChange={(event) => updateAssumption("proFormaVacancyPct", event.target.value)} /></div>
                <div><Label>Operating expense / unit / year</Label><Input className="mt-1" type="number" min="0" step="1" value={assumptions.proFormaOpexPerUnit as string || ""} onChange={(event) => updateAssumption("proFormaOpexPerUnit", event.target.value)} /></div>
              </div>
              <label className="flex items-center gap-3 text-sm"><Switch checked={assumptions.useTnForYoc === true} onCheckedChange={(checked) => updateAssumption("useTnForYoc", checked)} />Use trailing T-n for YOC</label>
              {assumptionsMutation.isError && <p className="text-sm text-red-700">{(assumptionsMutation.error as Error).message}</p>}
              {assumptionsMutation.isSuccess && <p className="text-sm text-emerald-700">Assumptions saved.</p>}
              <Button onClick={saveAssumptions} disabled={assumptionsMutation.isPending} className="border border-catalyst-blue bg-catalyst-navy text-white hover:bg-white hover:text-catalyst-blue">
                {assumptionsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save assumptions
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="acquisition-upload">
            <CardHeader><CardTitle>Upload acquisition documents</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {uploadKinds.map(({ kind, label }) => (
                  <label key={kind} className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50">
                    <FileUp className="h-4 w-4" />{label}
                    <input type="file" accept=".xls,.xlsx,.csv" className="sr-only" aria-label={`Upload ${label}`} onChange={(event) => { void handleUpload(kind, event.target.files?.[0]); event.currentTarget.value = ""; }} disabled={uploadMutation.isPending} />
                  </label>
                ))}
              </div>
              {uploadMutation.isPending && <p className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Uploading and processing…</p>}
              {uploadMessage && <p className="text-sm text-emerald-700">{uploadMessage}</p>}
              {uploadError && <p className="text-sm text-red-700">{uploadError}</p>}
              {mappingFile && uploadMessage.includes("Choose") && (
                <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4" data-testid="acquisition-column-mapping">
                  <h3 className="font-semibold text-[#0A2B4A]">Map rent-roll columns</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {mappingFields.map(([key, label]) => (
                      <div key={key}>
                        <Label htmlFor={`rent-roll-map-${key}`}>{label}</Label>
                        <select id={`rent-roll-map-${key}`} value={columnMapping[key] || ""} onChange={(event) => setColumnMapping((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
                          <option value="">Not mapped</option>
                          {detectedColumns.map((column) => <option key={column.index} value={column.index}>{column.header || `Column ${column.index + 1}`}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <Button type="button" onClick={() => uploadMutation.mutate({ ...mappingFile, mapping: mappingPayload })} disabled={uploadMutation.isPending || !("unit" in mappingPayload)} className="border border-catalyst-blue bg-catalyst-navy text-white hover:bg-white hover:text-catalyst-blue">Resubmit with mapping</Button>
                </div>
              )}
              {detectedColumns.length > 0 && (
                <details className="rounded-lg border border-slate-200 px-3 py-2">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700">Detected columns ({detectedColumns.length})</summary>
                  <ul className="mt-2 list-inside list-disc text-sm text-slate-600">{detectedColumns.map((column) => <li key={column.index}>{column.header || `Column ${column.index + 1}`}</li>)}</ul>
                </details>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
