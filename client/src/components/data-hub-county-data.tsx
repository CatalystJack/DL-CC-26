import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MAX_BYTES = 170 * 1024 * 1024;
type ImportPreview = { previewedRows: number; validRows: number; invalidRows: number; errors: Array<{row:number;reason:string}>; sampleRows: Array<{row:number;values:Record<string,unknown>}>; mappedColumns: string[] };
type ImportJob = { status: string; processedRows: number; totalRows: number|null; bytesProcessed: number; totalBytes: number; inserted: number; updated: number; skipped: number; errors: Array<{row:number;reason:string}>; message?: string };

export default function DataHubCountyData() {
  const [type, setType] = useState<"parcels"|"sales">("parcels");
  const [file, setFile] = useState<File|null>(null);
  const [preview, setPreview] = useState<ImportPreview|null>(null);
  const [jobId, setJobId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [county, setCounty] = useState("");
  const [zoning, setZoning] = useState("");
  const [landUseCode, setLandUseCode] = useState("");
  const [minAcres, setMinAcres] = useState("");
  const [maxAcres, setMaxAcres] = useState("");
  const [offset, setOffset] = useState(0);

  const params = new URLSearchParams({limit:"50", offset:String(offset)});
  if (county) params.set("county",county);
  if (zoning) params.set("zoning",zoning);
  if (landUseCode) params.set("landUseCode",landUseCode);
  if (minAcres) params.set("minAcres",minAcres);
  if (maxAcres) params.set("maxAcres",maxAcres);
  const parcels = useQuery<any>({
    queryKey: ["/api/data-hub/county-parcels", params.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/data-hub/county-parcels?${params}`, {credentials:"include"});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load county parcels.");
      return result;
    },
  });
  const job = useQuery<ImportJob>({
    queryKey: ["/api/data-hub/county-imports", jobId],
    enabled: Boolean(jobId),
    queryFn: async () => {
      const response = await fetch(`/api/data-hub/county-imports/${jobId}`, {credentials:"include"});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load import progress.");
      return result;
    },
    refetchInterval: (query: any) => ["processing","queued"].includes(query.state.data?.status) ? 1000 : false,
  });
  useEffect(() => {
    if (job.data?.status === "completed") void parcels.refetch();
  }, [job.data?.status]);

  const sendFile = async (previewOnly: boolean) => {
    if (!file) return;
    setBusy(true); setError("");
    const form = new FormData();
    form.append("file",file); form.append("type",type);
    try {
      const response = await fetch(previewOnly ? "/api/data-hub/county-imports/preview" : "/api/data-hub/county-imports", {
        method:"POST", credentials:"include", body:form,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "County import request failed.");
      if (previewOnly) setPreview(result);
      else { setJobId(result.jobId); setPreview(null); setFile(null); }
    } catch (e:any) { setError(e.message || "Request failed."); }
    finally { setBusy(false); }
  };
  const currentJob = job.data;
  const percent = currentJob?.totalBytes ? Math.min(100, Math.round(currentJob.bytesProcessed / currentJob.totalBytes * 100)) : 0;

  return <div className="space-y-5">
    <Card>
      <CardHeader><CardTitle>County parcels and sales</CardTitle><CardDescription>Admin-only CSV storage. Uploads stream from disk and import in batches. Maximum file size: 170 MB.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium">Import type
            <select className="mt-1 h-10 w-full rounded-md border bg-white px-3" value={type} onChange={e=>{setType(e.target.value as any);setPreview(null);}}>
              <option value="parcels">County parcels</option><option value="sales">County sales</option>
            </select>
          </label>
          <label className="text-sm font-medium">CSV file
            <input className="mt-1 block min-h-10 w-full text-sm" type="file" accept=".csv,text/csv" disabled={busy} onChange={e=>{setFile(e.target.files?.[0]||null);setPreview(null);e.currentTarget.value="";}} />
          </label>
        </div>
        {file && <p className="break-all text-sm text-muted-foreground">{file.name} · {(file.size/1024/1024).toFixed(1)} MB</p>}
        {file && file.size > MAX_BYTES && <p className="text-sm text-destructive">This file exceeds 170 MB.</p>}
        <div className="flex flex-wrap gap-2">
          <Button disabled={!file || busy || file.size>MAX_BYTES} onClick={()=>void sendFile(true)}>{busy?"Uploading…":"Preview first 25 rows"}</Button>
          {preview && <Button variant="outline" disabled={busy} onClick={()=>void sendFile(false)}>Start import</Button>}
        </div>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        {preview && <div className="space-y-3 rounded-md border p-3">
          <p className="text-sm font-medium">Previewed {preview.previewedRows} rows · {preview.validRows} valid · {preview.invalidRows} invalid</p>
          <p className="break-words text-xs text-muted-foreground">Columns: {preview.mappedColumns.join(", ")}</p>
          {preview.errors.map((item,i)=><p className="text-sm text-destructive" key={`${item.row}-${i}`}>Row {item.row}: {item.reason}</p>)}
          <div className="table-scroll-container"><Table><TableHeader><TableRow><TableHead>Row</TableHead><TableHead>County</TableHead><TableHead>Parcel ID</TableHead><TableHead>Address</TableHead><TableHead>Acres</TableHead></TableRow></TableHeader>
            <TableBody>{preview.sampleRows.map(row=><TableRow key={row.row}><TableCell>{row.row}</TableCell><TableCell>{String(row.values.county||"")}</TableCell><TableCell>{String(row.values.parcelId||"")}</TableCell><TableCell className="max-w-56 truncate">{String(row.values.situsAddress||"")}</TableCell><TableCell>{String(row.values.acres||"")}</TableCell></TableRow>)}</TableBody>
          </Table></div>
        </div>}
        {currentJob && <div className="space-y-2 rounded-md border p-3" aria-live="polite">
          <p className="text-sm font-semibold">Import {currentJob.status}</p><Progress value={percent}/>
          <p className="text-sm text-muted-foreground">{currentJob.processedRows.toLocaleString()} rows processed · {percent}% of file · {currentJob.inserted.toLocaleString()} inserted · {currentJob.updated.toLocaleString()} updated · {currentJob.skipped.toLocaleString()} skipped</p>
          {currentJob.message && <p className="text-sm text-destructive">{currentJob.message}</p>}
          {currentJob.errors.slice(0,20).map((item,i)=><p className="text-xs text-destructive" key={`${item.row}-${i}`}>Row {item.row}: {item.reason}</p>)}
        </div>}
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle>Browse county parcels</CardTitle><CardDescription>{parcels.data?.totalRows?.toLocaleString() ?? 0} matching rows</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <Input placeholder="County" value={county} onChange={e=>{setCounty(e.target.value);setOffset(0);}}/>
          <Input placeholder="Zoning" value={zoning} onChange={e=>{setZoning(e.target.value);setOffset(0);}}/>
          <Input placeholder="Land-use code" value={landUseCode} onChange={e=>{setLandUseCode(e.target.value);setOffset(0);}}/>
          <Input type="number" min="0" placeholder="Min acres" value={minAcres} onChange={e=>{setMinAcres(e.target.value);setOffset(0);}}/>
          <Input type="number" min="0" placeholder="Max acres" value={maxAcres} onChange={e=>{setMaxAcres(e.target.value);setOffset(0);}}/>
        </div>
        {parcels.data?.countyCounts?.length>0 && <div className="flex flex-wrap gap-2 text-xs">{parcels.data.countyCounts.map((row:any)=><span key={row.county} className="rounded-full bg-slate-100 px-2 py-1">{row.county}: {Number(row.count).toLocaleString()}</span>)}</div>}
        {parcels.isError && <p className="text-sm text-destructive">Could not load parcels.</p>}
        <div className="table-scroll-container"><Table><TableHeader><TableRow><TableHead>County</TableHead><TableHead>Parcel ID</TableHead><TableHead>Owner</TableHead><TableHead>Site address</TableHead><TableHead>Land use</TableHead><TableHead>Zoning</TableHead><TableHead>Acres</TableHead><TableHead>Total value</TableHead></TableRow></TableHeader>
          <TableBody>{(parcels.data?.rows||[]).map((row:any)=><TableRow key={row.id}><TableCell>{row.county}, {row.state}</TableCell><TableCell>{row.parcelId}</TableCell><TableCell>{row.ownerName||"—"}</TableCell><TableCell>{row.situsAddress||"—"}</TableCell><TableCell>{row.landUseCode||"—"} {row.landUseDesc||""}</TableCell><TableCell>{row.zoning||"—"}</TableCell><TableCell>{row.acres||"—"}</TableCell><TableCell>{row.totalValue||"—"}</TableCell></TableRow>)}</TableBody>
        </Table></div>
        <div className="flex items-center justify-between"><Button variant="outline" disabled={!offset} onClick={()=>setOffset(Math.max(0,offset-50))}>Previous</Button><span className="text-sm text-muted-foreground">Rows {parcels.data?.totalRows ? offset+1 : 0}–{Math.min(offset+50,parcels.data?.totalRows||0)}</span><Button variant="outline" disabled={!parcels.data || offset+50>=parcels.data.totalRows} onClick={()=>setOffset(offset+50)}>Next</Button></div>
      </CardContent>
    </Card>
  </div>;
}
