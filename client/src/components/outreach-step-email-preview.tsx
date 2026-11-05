import { useState } from "react";
import { Download, Eye } from "lucide-react";
import { renderOutreachEmailBody } from "@shared/outreach-email-renderer";
import { sanitizeSignatureHtml } from "@shared/signature-html";
import { applyOutreachMergeFields, OUTREACH_PREVIEW_SAMPLE_VALUES } from "@shared/outreach-personalization";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type EmailStepAttachment = {
  filename: string;
  url?: string | null;
  contentType?: string;
  size?: number;
};

export function normalizeEmailStepAttachments(value: unknown): EmailStepAttachment[] {
  let parsed = value;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];

  return parsed.filter((item): item is EmailStepAttachment =>
    Boolean(item && typeof item === "object" && typeof item.filename === "string" && item.filename.trim()),
  );
}

function safeAttachmentHref(url?: string | null): string | null {
  if (typeof url !== "string" || !url.trim()) return null;
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    if (parsed.pathname.startsWith("/api/private/storage/.private/campaign-attachments/")) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return url;
  } catch {
    return null;
  }
}

function attachmentDownloadHref(href: string): string {
  const parsed = new URL(href, window.location.origin);
  if (parsed.pathname.startsWith("/api/private/storage/")) {
    parsed.searchParams.set("download", "1");
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  }
  return href;
}

export function AttachmentFilenameLink({
  filename,
  url,
  className = "",
}: {
  filename: string;
  url?: string | null;
  className?: string;
}) {
  const href = safeAttachmentHref(url);
  if (!href) return <span className={className}>{filename}</span>;
  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-2">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`min-w-0 truncate text-blue-700 underline underline-offset-2 hover:text-blue-900 ${className}`}
      >
        {filename}
      </a>
      <a
        href={attachmentDownloadHref(href)}
        download={filename}
        className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
        aria-label={`Download ${filename}`}
      >
        <Download className="h-3.5 w-3.5" />
        Download
      </a>
    </span>
  );
}

export function OutreachStepEmailPreview({
  subject,
  content,
  attachments = [],
  signatureHtml,
  lineHeight = "1.5",
}: {
  subject?: string | null;
  content?: string | null;
  attachments?: EmailStepAttachment[];
  signatureHtml?: string | null;
  lineHeight?: string;
}) {
  const [open, setOpen] = useState(false);
  const canPreview = Boolean(subject?.trim() || content?.trim());
  if (!canPreview) return null;

  const merged = applyOutreachMergeFields(
    {
      subject: subject || "",
      body: content || "",
      signature: signatureHtml ? sanitizeSignatureHtml(signatureHtml) : "",
    },
    OUTREACH_PREVIEW_SAMPLE_VALUES,
  );
  const renderedBody = renderOutreachEmailBody(
    merged.body,
    merged.signature || "",
  );

  return (
    <>
      <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Eye className="mr-1.5 h-4 w-4" />
        Preview email
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email preview</DialogTitle>
            <DialogDescription>
              Sample merge values are shown. This preview does not send email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md border bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Subject</p>
              <p className="mt-1 break-words text-sm font-semibold text-slate-900">{merged.subject || "(No subject)"}</p>
            </div>
            <div
              className="max-w-none rounded-md border bg-white p-4 text-sm text-slate-800 [&_table]:w-auto [&_table]:max-w-full [&_td]:!align-top [&_img]:max-w-none"
              style={{ lineHeight }}
              dangerouslySetInnerHTML={{ __html: renderedBody.htmlBody }}
            />
            {attachments.length > 0 && (
              <div className="space-y-2 border-t pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Attachments</p>
                <ul className="space-y-1 text-sm">
                  {attachments.map((attachment, index) => (
                    <li key={`${attachment.filename}-${index}`} className="flex min-w-0 items-center gap-2">
                      <AttachmentFilenameLink
                        filename={attachment.filename}
                        url={attachment.url}
                        className="min-w-0 truncate"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
