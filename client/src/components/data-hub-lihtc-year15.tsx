import { useEffect, useState } from "react";

type PropertyRow = {
  hudId: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  county: string | null;
  units: number | null;
  liUnits: number | null;
  placedInService: string | null;
  allocationYear: number | null;
  complianceEndYear: number | null;
  extendedUseMinEndYear: number | null;
  year15Window: string;
  source: string;
};

type Preview = { validRows: number; invalidRows: number; errors: Array<{ row: number; reason: string }> };
const WINDOW_LABELS: Record<string, string> = {
  past: "Past",
  within_12_months: "Within 12 months",
  "12_24_months": "12 to 24 months",
  "2_5_years": "2 to 5 years",
  "over_5_years": "Over 5 years",
  unknown: "Unknown",
};

export default function DataHubLihtcYear15({
  canImport,
  canSync,
}: {
  canImport: boolean;
  canSync: boolean;
}) {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [county, setCounty] = useState("");
  const [windowFilter, setWindowFilter] = useState("");
  const [rows, setRows] = useState<PropertyRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const limit = 50;

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      if (search.trim()) params.set("search", search.trim());
      if (state.trim()) params.set("state", state.trim());
      if (county.trim()) params.set("county", county.trim());
      if (windowFilter) params.set("window", windowFilter);
      try {
        const response = await fetch(`/api/data-hub/lihtc-year15?${params}`, {
          credentials: "include",
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load properties.");
        setRows(result.properties || []);
        setTotal(result.total || 0);
      } catch (error: any) {
        if (error.name !== "AbortError") setMessage(error.message);
      }
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search, state, county, windowFilter, offset]);

  const previewCsv = async (selected: File | null) => {
    if (!selected) return;
    setFile(selected);
    setPreview(null);
    setBusy(true);
    setMessage("");
    try {
      const form = new FormData();
      form.append("file", selected);
      const response = await fetch("/api/data-hub/lihtc-year15/import/preview", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Preview failed.");
      setPreview(result);
      setMessage(`Preview: ${result.validRows} valid, ${result.invalidRows} invalid rows.`);
    } catch (error: any) {
      setMessage(error.message);
      setFile(null);
    } finally {
      setBusy(false);
    }
  };

  const runAction = async (url: string, body?: FormData) => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        ...(body ? { body } : {}),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Request failed.");
      setMessage(`${result.inserted} inserted, ${result.updated} updated, ${result.skipped} skipped.`);
      setFile(null);
      setPreview(null);
      setOffset(0);
      const refresh = await fetch("/api/data-hub/lihtc-year15?limit=50", { credentials: "include" });
      const data = await refresh.json();
      if (refresh.ok) {
        setRows(data.properties || []);
        setTotal(data.total || 0);
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <header className="bg-[#000914] px-4 py-4 text-white sm:px-6">
        <h2 className="text-lg font-semibold">LIHTC Year 15</h2>
        <p className="mt-1 text-sm text-white/75">
          Data: Year Fifteen (lihtc.loan) + HUD LIHTCPUB. CC BY 4.0.
        </p>
      </header>
      <div className="space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input aria-label="Search properties" value={search} onChange={(event) => { setOffset(0); setSearch(event.target.value); }} placeholder="Search name, HUD ID, address" className="min-h-11 rounded-md border px-3 text-sm" />
          <input aria-label="Filter by state" value={state} onChange={(event) => { setOffset(0); setState(event.target.value.toUpperCase().slice(0, 2)); }} placeholder="State" maxLength={2} className="min-h-11 rounded-md border px-3 text-sm" />
          <input aria-label="Filter by county" value={county} onChange={(event) => { setOffset(0); setCounty(event.target.value); }} placeholder="County" className="min-h-11 rounded-md border px-3 text-sm" />
          <select aria-label="Filter by Year 15 window" value={windowFilter} onChange={(event) => { setOffset(0); setWindowFilter(event.target.value); }} className="min-h-11 rounded-md border bg-white px-3 text-sm">
            <option value="">All Year 15 windows</option>
            {Object.entries(WINDOW_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canImport && (
            <label className="inline-flex min-h-11 cursor-pointer items-center rounded-md border px-4 text-sm font-medium hover:bg-slate-50">
              Import CSV
              <input type="file" accept=".csv,text/csv" className="sr-only" disabled={busy} onChange={(event) => { void previewCsv(event.target.files?.[0] || null); event.currentTarget.value = ""; }} />
            </label>
          )}
          {canSync && <button type="button" disabled={busy} onClick={() => void runAction("/api/data-hub/lihtc-year15/sync")} className="min-h-11 rounded-md border border-transparent bg-[#000914] px-4 text-sm font-semibold text-white hover:border-[#4A90E2] hover:bg-white hover:text-[#4A90E2] disabled:opacity-50">Sync from free feed</button>}
          <span className="text-sm text-slate-600">{total.toLocaleString()} properties</span>
        </div>
        {preview && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
            <p>{preview.validRows} valid rows, {preview.invalidRows} invalid rows.</p>
            {preview.errors.slice(0, 5).map((error) => <p key={`${error.row}-${error.reason}`}>Row {error.row}: {error.reason}</p>)}
            <div className="mt-3 flex gap-2">
              <button type="button" disabled={busy || !file || preview.validRows === 0} onClick={() => {
                const form = new FormData();
                if (file) form.append("file", file);
                void runAction("/api/data-hub/lihtc-year15/import", form);
              }} className="min-h-10 rounded-md border border-transparent bg-[#000914] px-3 text-white hover:border-[#4A90E2] hover:bg-white hover:text-[#4A90E2] disabled:opacity-50">Import valid rows</button>
              <button type="button" disabled={busy} onClick={() => { setFile(null); setPreview(null); }} className="min-h-10 rounded-md border px-3">Cancel</button>
            </div>
          </div>
        )}
        {message && <p role="status" className="text-sm text-slate-700">{message}</p>}
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-600">
              <tr>{["Property", "HUD ID", "Location", "Units", "PIS", "Compliance", "Extended use", "Year 15 window"].map((label) => <th key={label} className="px-3 py-2">{label}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row) => <tr key={row.hudId} className="border-t">
                <td className="px-3 py-2 font-medium">{row.name}</td>
                <td className="px-3 py-2">{row.hudId}</td>
                <td className="px-3 py-2">{[row.city, row.state, row.county, row.zip].filter(Boolean).join(", ")}</td>
                <td className="px-3 py-2">{row.liUnits ?? row.units ?? "Not listed"}</td>
                <td className="px-3 py-2">{row.placedInService || "Not listed"}</td>
                <td className="px-3 py-2">{row.complianceEndYear ?? "Not listed"}</td>
                <td className="px-3 py-2">{row.extendedUseMinEndYear ?? "Not listed"}</td>
                <td className="px-3 py-2">{WINDOW_LABELS[row.year15Window] || "Unknown"}</td>
              </tr>)}
              {!rows.length && <tr><td colSpan={8} className="px-3 py-8 text-center text-slate-500">No matching properties.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between text-sm">
          <button type="button" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))} className="min-h-10 rounded-md border px-3 disabled:opacity-40">Previous</button>
          <span>{total ? `${offset + 1} to ${Math.min(offset + limit, total)} of ${total}` : "0 results"}</span>
          <button type="button" disabled={offset + limit >= total} onClick={() => setOffset(offset + limit)} className="min-h-10 rounded-md border px-3 disabled:opacity-40">Next</button>
        </div>
      </div>
    </section>
  );
}
