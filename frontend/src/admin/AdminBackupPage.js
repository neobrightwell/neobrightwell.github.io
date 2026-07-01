import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Upload, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  adminExportBackup,
  adminImportBackup,
  getSubscribersCsvBlob,
} from "@/api/client";

// Trigger a browser file download from an in-memory Blob.
function triggerBrowserDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export default function AdminBackupPage() {
  const [downloadingContent, setDownloadingContent] = useState(false);
  const [downloadingSubs, setDownloadingSubs] = useState(false);
  const [pendingImport, setPendingImport] = useState(null); // parsed JSON awaiting confirmation
  const [importing, setImporting] = useState(false);
  const [lastReport, setLastReport] = useState(null);
  const fileInputRef = useRef(null);

  const downloadContentBackup = async () => {
    setDownloadingContent(true);
    try {
      const data = await adminExportBackup();
      const filename = `neoverse-backup-${new Date().toISOString().slice(0, 10)}.json`;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      triggerBrowserDownload(blob, filename);
      toast.success("Backup downloaded.");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Could not download backup.");
    } finally {
      setDownloadingContent(false);
    }
  };

  const downloadSubscribersCsv = async () => {
    setDownloadingSubs(true);
    try {
      const blob = await getSubscribersCsvBlob();
      const filename = `neoverse-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      triggerBrowserDownload(blob, filename);
      toast.success("Subscribers CSV downloaded.");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Could not download subscribers.");
    } finally {
      setDownloadingSubs(false);
    }
  };

  const onFileChosen = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (!json || typeof json !== "object" || !json.collections) {
        toast.error("This file doesn't look like a Neoverse backup.");
        return;
      }
      setPendingImport({ filename: file.name, data: json });
    } catch {
      toast.error("Could not parse the file as JSON.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""; // reset so re-picking works
    }
  };

  const confirmImport = async () => {
    if (!pendingImport) return;
    setImporting(true);
    try {
      const res = await adminImportBackup(pendingImport.data);
      setLastReport(res.report || null);
      toast.success("Restore complete.");
      setPendingImport(null);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Restore failed.");
    } finally {
      setImporting(false);
    }
  };

  const previewCounts = pendingImport ? countByCollection(pendingImport.data) : null;

  return (
    <div className="max-w-[880px]">
      <header className="mb-8">
        <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] mb-2">
          Backup &amp; Restore
        </p>
        <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)]">
          Save the archive.
        </h1>
        <p className="mt-3 font-serif italic text-[rgba(231,224,214,0.7)] leading-relaxed">
          Download a JSON snapshot of every album, poem, symbol, roadhouse post,
          artwork, and editable page. Restore it later — on the same site, or on
          a fresh deployment — and everything is put back exactly where you
          left it. Subscribers are exported separately as a CSV so personal
          data is always an intentional action.
        </p>
      </header>

      {/* Content backup */}
      <section className="rounded-xl border border-border/70 bg-[hsl(var(--card))] p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-[rgba(199,168,106,0.9)] mt-1">
            <Download size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl text-[rgba(231,224,214,0.95)]">
              Content backup (JSON)
            </h2>
            <p className="mt-1 text-sm text-[rgba(231,224,214,0.7)] leading-relaxed">
              Everything under Albums, Library, Symbols, Roadhouse, Observatory
              and Pages — including uploaded images (which are stored inline).
              Downloads directly to your device.
            </p>
            <div className="mt-4">
              <Button
                onClick={downloadContentBackup}
                disabled={downloadingContent}
                data-testid="admin-backup-download"
              >
                {downloadingContent ? "Preparing…" : "Download content backup"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Restore */}
      <section className="rounded-xl border border-border/70 bg-[hsl(var(--card))] p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-[rgba(199,168,106,0.9)] mt-1">
            <Upload size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl text-[rgba(231,224,214,0.95)]">
              Restore from backup
            </h2>
            <p className="mt-1 text-sm text-[rgba(231,224,214,0.7)] leading-relaxed">
              Upload a JSON backup and it will be merged into the current
              database. Existing documents (matched by slug) are overwritten;
              new documents are inserted. Nothing is deleted.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={onFileChosen}
                className="hidden"
                data-testid="admin-backup-file-input"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                data-testid="admin-backup-choose-file"
              >
                Choose backup file…
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribers CSV */}
      <section className="rounded-xl border border-border/70 bg-[hsl(var(--card))] p-6">
        <div className="flex items-start gap-4">
          <div className="text-[rgba(199,168,106,0.9)] mt-1">
            <FileText size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl text-[rgba(231,224,214,0.95)]">
              Subscribers (CSV)
            </h2>
            <p className="mt-1 text-sm text-[rgba(231,224,214,0.7)] leading-relaxed">
              Downloads every Invocation subscriber's email address and metadata
              as CSV. Contains personal data — handle accordingly (encrypted
              storage, GDPR obligations, etc.).
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={downloadSubscribersCsv}
                disabled={downloadingSubs}
                data-testid="admin-backup-subscribers-csv"
              >
                {downloadingSubs ? "Preparing…" : "Download subscribers CSV"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {lastReport && (
        <section className="mt-8 rounded-xl border border-border/70 bg-[hsl(var(--card))] p-5">
          <h3 className="font-serif text-lg text-[rgba(231,224,214,0.95)] mb-3">
            Last restore report
          </h3>
          <table className="text-sm">
            <tbody>
              {Object.entries(lastReport).map(([name, r]) => (
                <tr key={name} className="border-t border-[rgba(199,194,184,0.08)]">
                  <td className="pr-6 py-1.5 font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)] uppercase">
                    {name}
                  </td>
                  <td className="pr-4 py-1.5 text-[rgba(231,224,214,0.85)]">
                    <span className="text-[rgba(120,190,120,0.9)]">{r.inserted ?? 0}</span> inserted{" "}
                    · <span className="text-[rgba(199,168,106,0.9)]">{r.updated ?? 0}</span> updated
                    {(r.skipped || 0) > 0 && <> · <span className="text-[rgba(199,194,184,0.7)]">{r.skipped}</span> skipped</>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Restore confirmation dialog */}
      <Dialog open={!!pendingImport} onOpenChange={(o) => !o && setPendingImport(null)}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-[rgba(199,168,106,0.95)]" size={18} />
              Restore from backup
            </DialogTitle>
            <DialogDescription>
              About to restore <span className="font-mono text-[rgba(231,224,214,0.85)]">{pendingImport?.filename}</span>. Existing content will be overwritten where slugs match.
            </DialogDescription>
          </DialogHeader>
          {previewCounts && (
            <div className="rounded-lg border border-border/60 p-3 space-y-1">
              {Object.entries(previewCounts).map(([name, n]) => (
                <div key={name} className="flex justify-between text-sm">
                  <span className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)] uppercase">{name}</span>
                  <span className="text-[rgba(231,224,214,0.85)]">{n} document{n === 1 ? "" : "s"}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingImport(null)}
              disabled={importing}
              data-testid="admin-backup-cancel-restore"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmImport}
              disabled={importing}
              data-testid="admin-backup-confirm-restore"
            >
              {importing ? "Restoring…" : "Restore now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function countByCollection(data) {
  const out = {};
  const c = data?.collections || {};
  for (const [name, docs] of Object.entries(c)) {
    if (Array.isArray(docs)) out[name] = docs.length;
  }
  return out;
}
