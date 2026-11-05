import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Loader2, Paperclip, Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AttachmentFilenameLink, OutreachStepEmailPreview } from "@/components/outreach-step-email-preview";

type Attachment = { filename: string; url?: string | null; contentType?: string; size?: number };
type Step = { id: string; sequenceIndex: number; dayNumber: number; subject: string; content: string; attachments: Attachment[] };
type Campaign = { id: string; name: string; status: string; triggerTag: string; stepCount: number; enrollmentCount: number };

async function request(url: string, options?: RequestInit) {
  const response = await fetch(url, { credentials: "include", ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || payload.message || "Request failed");
  return payload;
}

export default function AdminCompanyCampaigns({ profileId }: { profileId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [triggerTag, setTriggerTag] = useState("");
  const [activeCampaignId, setActiveCampaignId] = useState("");
  const [stepDraft, setStepDraft] = useState<Partial<Step> | null>(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const base = `/api/admin/investment-companies/${encodeURIComponent(profileId)}/outreach/campaigns`;
  const campaignsQuery = useQuery<{ campaigns: Campaign[] }>({
    queryKey: [base],
    queryFn: () => request(base),
  });
  const stepsQuery = useQuery<Step[]>({
    queryKey: [base, activeCampaignId, "steps"],
    queryFn: () => request(`${base}/${activeCampaignId}/steps`),
    enabled: Boolean(activeCampaignId),
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: [base] });
    if (activeCampaignId) queryClient.invalidateQueries({ queryKey: [base, activeCampaignId, "steps"] });
  };
  const createMutation = useMutation({
    mutationFn: () => request(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, triggerTag }) }),
    onSuccess: (result) => {
      setName("");
      setTriggerTag("");
      setActiveCampaignId(result.campaign.id);
      refresh();
      toast({ title: "Campaign created paused" });
    },
    onError: (error: Error) => toast({ title: "Campaign was not created", description: error.message, variant: "destructive" }),
  });
  const saveCampaignMutation = useMutation({
    mutationFn: (campaign: Campaign) => request(`${base}/${campaign.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: campaign.name, triggerTag: campaign.triggerTag }) }),
    onSuccess: () => { refresh(); toast({ title: "Campaign details saved" }); },
    onError: (error: Error) => toast({ title: "Could not save campaign", description: error.message, variant: "destructive" }),
  });
  const addStepMutation = useMutation({
    mutationFn: () => request(`${base}/${activeCampaignId}/steps`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(stepDraft) }),
    onSuccess: () => { setStepDraft(null); refresh(); toast({ title: "Step added" }); },
    onError: (error: Error) => toast({ title: "Could not add step", description: error.message, variant: "destructive" }),
  });
  const editStepMutation = useMutation({
    mutationFn: (step: Step) => request(`${base}/${activeCampaignId}/steps/${step.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(step) }),
    onSuccess: () => { setStepDraft(null); refresh(); toast({ title: "Step saved" }); },
    onError: (error: Error) => toast({ title: "Could not save step", description: error.message, variant: "destructive" }),
  });
  const deleteStepMutation = useMutation({
    mutationFn: (stepId: string) => request(`${base}/${activeCampaignId}/steps/${stepId}`, { method: "DELETE" }),
    onSuccess: refresh,
    onError: (error: Error) => toast({ title: "Could not delete step", description: error.message, variant: "destructive" }),
  });
  const reorderMutation = useMutation({
    mutationFn: (stepIds: string[]) => request(`${base}/${activeCampaignId}/steps/reorder`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stepIds }) }),
    onSuccess: refresh,
    onError: (error: Error) => toast({ title: "Could not reorder steps", description: error.message, variant: "destructive" }),
  });
  const changeStep = (patch: Partial<Step>) => setStepDraft((current) => ({ ...current, ...patch }));
  const attachFile = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File is too large", description: "Attachments are limited to 50 MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const item = await request("/api/upload/attachment", { method: "POST", body: form });
      changeStep({ attachments: [...(stepDraft?.attachments || []), { filename: item.filename, url: item.url, contentType: item.contentType, size: item.size }] });
    } catch (error) {
      toast({ title: "Could not upload attachment", description: error instanceof Error ? error.message : "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };
  const campaigns = campaignsQuery.data?.campaigns || [];
  const steps = stepsQuery.data || [];
  return <Card className="border-blue-200">
    <CardHeader><CardTitle>Company outreach campaigns</CardTitle><p className="text-sm text-slate-500">Campaigns use the same records as the company outreach page. New campaigns always start paused. This admin editor never enrolls contacts or sends messages.</p></CardHeader>
    <CardContent className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div><Label>Campaign name</Label><Input value={name} maxLength={160} onChange={(event) => setName(event.target.value)} /></div>
        <div><Label>Auto-enrollment trigger tag</Label><Input value={triggerTag} maxLength={160} onChange={(event) => setTriggerTag(event.target.value)} /></div>
        <Button className="self-end" disabled={!name.trim() || !triggerTag.trim() || createMutation.isPending} onClick={() => createMutation.mutate()}>{createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}Create paused</Button>
      </div>
      {campaignsQuery.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : campaignsQuery.isError ? <p className="text-sm text-red-700">Could not load campaigns for this company.</p> : campaigns.length === 0 ? <p className="text-sm text-slate-500">No campaigns for this company yet.</p> : <div className="space-y-3">
        {campaigns.map((campaign) => <div key={campaign.id} className="rounded-lg border p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Input aria-label="Campaign name" value={campaign.name} onChange={(event) => queryClient.setQueryData([base], (old: any) => ({ ...old, campaigns: old.campaigns.map((row: Campaign) => row.id === campaign.id ? { ...row, name: event.target.value } : row) }))} className="max-w-xs" />
            <Input aria-label="Trigger tag" value={campaign.triggerTag} onChange={(event) => queryClient.setQueryData([base], (old: any) => ({ ...old, campaigns: old.campaigns.map((row: Campaign) => row.id === campaign.id ? { ...row, triggerTag: event.target.value } : row) }))} className="max-w-xs" />
            <Badge variant="secondary">{campaign.status}</Badge>
            <span className="text-xs text-slate-500">{campaign.enrollmentCount} enrollments · {campaign.stepCount} steps</span>
            <Button variant="outline" size="sm" onClick={() => saveCampaignMutation.mutate(campaign)}><Save className="mr-1 h-3.5 w-3.5" />Save</Button>
            <Button variant="outline" size="sm" onClick={() => setActiveCampaignId(activeCampaignId === campaign.id ? "" : campaign.id)}>{activeCampaignId === campaign.id ? "Hide steps" : "Manage steps"}</Button>
          </div>
          {activeCampaignId === campaign.id && <div className="mt-4 space-y-3">
            {stepsQuery.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : steps.map((step, index) => <div key={step.id} className="rounded-md border bg-slate-50 p-3">
              {stepDraft?.id === step.id ? <div className="space-y-2">
                <div className="grid gap-2 sm:grid-cols-2"><div><Label>Day number</Label><Input type="number" min={0} max={365} value={stepDraft.dayNumber ?? 0} onChange={(event) => changeStep({ dayNumber: Number(event.target.value) })} /></div><div><Label>Subject</Label><Input maxLength={240} value={stepDraft.subject || ""} onChange={(event) => changeStep({ subject: event.target.value })} /></div></div>
                <div><Label>Content</Label><Textarea rows={6} value={stepDraft.content || ""} onChange={(event) => changeStep({ content: event.target.value })} /></div>
                <div className="flex flex-wrap items-center gap-2">
                  <Input aria-label="Attachment filename" placeholder="Filename" value={attachmentName} onChange={(event) => setAttachmentName(event.target.value)} className="max-w-48" />
                  <Input aria-label="Attachment URL" placeholder="Attachment URL" value={attachmentUrl} onChange={(event) => setAttachmentUrl(event.target.value)} className="min-w-48 flex-1" />
                  <Button type="button" variant="outline" size="sm" disabled={!attachmentName.trim() || !attachmentUrl.trim()} onClick={() => { changeStep({ attachments: [...(stepDraft.attachments || []), { filename: attachmentName.trim(), url: attachmentUrl.trim(), contentType: "application/octet-stream" }] }); setAttachmentName(""); setAttachmentUrl(""); }}><Paperclip className="mr-1 h-3.5 w-3.5" />Add link</Button>
                  <label className="cursor-pointer text-sm"><input type="file" className="sr-only" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void attachFile(file); event.currentTarget.value = ""; }} />{uploading ? "Uploading…" : "Upload file"}</label>
                </div>
                {(stepDraft.attachments || []).map((item, attachmentIndex) => <div key={`${item.url || item.filename}-${attachmentIndex}`} className="flex items-center justify-between gap-2 text-xs"><AttachmentFilenameLink filename={item.filename} url={item.url} className="min-w-0 flex-1 truncate" /><Button aria-label={`Remove ${item.filename}`} variant="ghost" size="sm" onClick={() => changeStep({ attachments: (stepDraft.attachments || []).filter((_, i) => i !== attachmentIndex) })}><Trash2 className="h-3.5 w-3.5" /></Button></div>)}
                <OutreachStepEmailPreview subject={stepDraft.subject} content={stepDraft.content} attachments={stepDraft.attachments || []} />
                <div className="flex gap-2"><Button size="sm" onClick={() => stepDraft.id ? editStepMutation.mutate(stepDraft as Step) : addStepMutation.mutate()} disabled={!stepDraft.subject?.trim() || !stepDraft.content?.trim()}>Save step</Button><Button size="sm" variant="outline" onClick={() => setStepDraft(null)}>Cancel</Button></div>
              </div> : <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">Day {step.dayNumber}</Badge><span className="min-w-0 flex-1 truncate text-sm font-medium">{step.subject}</span><span className="text-xs text-slate-500">{step.attachments?.length || 0} attachments</span>
                {step.attachments?.map((attachment, attachmentIndex) => <AttachmentFilenameLink key={`${attachment.url || attachment.filename}-${attachmentIndex}`} filename={attachment.filename} url={attachment.url} className="max-w-full truncate text-sm" />)}
                <OutreachStepEmailPreview subject={step.subject} content={step.content} attachments={step.attachments || []} />
                <Button variant="outline" size="icon" aria-label="Move step up" disabled={index === 0} onClick={() => { const ids = steps.map((row) => row.id); [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]]; reorderMutation.mutate(ids); }}><ChevronUp className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" aria-label="Move step down" disabled={index === steps.length - 1} onClick={() => { const ids = steps.map((row) => row.id); [ids[index + 1], ids[index]] = [ids[index], ids[index + 1]]; reorderMutation.mutate(ids); }}><ChevronDown className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => { setStepDraft({ ...step, attachments: [...(step.attachments || [])] }); setAttachmentName(""); setAttachmentUrl(""); }}>Edit</Button>
                 <Button variant="ghost" size="icon" aria-label="Delete step" onClick={() => {
                   if (window.confirm(`Delete the step scheduled for day ${step.dayNumber}? This cannot be undone.`)) {
                     deleteStepMutation.mutate(step.id);
                   }
                 }}><Trash2 className="h-4 w-4 text-red-600" /></Button>
              </div>}
            </div>)}
             {stepDraft && !stepDraft.id && <div className="rounded-md border bg-slate-50 p-3">
               <div className="space-y-2">
                 <div className="grid gap-2 sm:grid-cols-2"><div><Label>Day number</Label><Input type="number" min={0} max={365} value={stepDraft.dayNumber ?? 0} onChange={(event) => changeStep({ dayNumber: Number(event.target.value) })} /></div><div><Label>Subject</Label><Input maxLength={240} value={stepDraft.subject || ""} onChange={(event) => changeStep({ subject: event.target.value })} /></div></div>
                 <div><Label>Content</Label><Textarea rows={6} value={stepDraft.content || ""} onChange={(event) => changeStep({ content: event.target.value })} /></div>
                 <div className="flex flex-wrap items-center gap-2">
                   <Input aria-label="Attachment filename" placeholder="Filename" value={attachmentName} onChange={(event) => setAttachmentName(event.target.value)} className="max-w-48" />
                   <Input aria-label="Attachment URL" placeholder="Attachment URL" value={attachmentUrl} onChange={(event) => setAttachmentUrl(event.target.value)} className="min-w-48 flex-1" />
                   <Button type="button" variant="outline" size="sm" disabled={!attachmentName.trim() || !attachmentUrl.trim()} onClick={() => { changeStep({ attachments: [...(stepDraft.attachments || []), { filename: attachmentName.trim(), url: attachmentUrl.trim(), contentType: "application/octet-stream" }] }); setAttachmentName(""); setAttachmentUrl(""); }}><Paperclip className="mr-1 h-3.5 w-3.5" />Add link</Button>
                   <label className="cursor-pointer text-sm"><input type="file" className="sr-only" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void attachFile(file); event.currentTarget.value = ""; }} />{uploading ? "Uploading…" : "Upload file"}</label>
                 </div>
                 {(stepDraft.attachments || []).map((item, attachmentIndex) => <div key={`${item.url || item.filename}-${attachmentIndex}`} className="flex items-center justify-between gap-2 text-xs"><AttachmentFilenameLink filename={item.filename} url={item.url} className="min-w-0 flex-1 truncate" /><Button aria-label={`Remove ${item.filename}`} variant="ghost" size="sm" onClick={() => changeStep({ attachments: (stepDraft.attachments || []).filter((_, i) => i !== attachmentIndex) })}><Trash2 className="h-3.5 w-3.5" /></Button></div>)}
                 <OutreachStepEmailPreview subject={stepDraft.subject} content={stepDraft.content} attachments={stepDraft.attachments || []} />
                 <div className="flex gap-2"><Button size="sm" onClick={() => addStepMutation.mutate()} disabled={!stepDraft.subject?.trim() || !stepDraft.content?.trim() || addStepMutation.isPending}>Save step</Button><Button size="sm" variant="outline" onClick={() => setStepDraft(null)}>Cancel</Button></div>
               </div>
             </div>}
            {!stepDraft && <Button variant="outline" onClick={() => setStepDraft({ dayNumber: steps.length ? steps[steps.length - 1].dayNumber + 30 : 0, subject: "", content: "", attachments: [] })}><Plus className="mr-1 h-4 w-4" />Add step</Button>}
          </div>}
        </div>)}
      </div>}
    </CardContent>
  </Card>;
}
