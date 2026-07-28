"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Trash2, Globe, Lock, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Credential {
  id: string;
  certName: string;
  issueDate: string;
  fileName: string;
  previewUrl: string | null;
  isImage: boolean;
  isPublic: boolean;
}

interface DbCredentialRow {
  id: string;
  cert_name: string;
  issue_date: string | null;
  document_url: string | null;
  is_public: boolean;
  signedUrl: string | null;
}

export function CredentialVault() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isReal, setIsReal] = useState(false);
  const [certName, setCertName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/credentials")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (!body?.credentials) return;
        setCredentials(
          (body.credentials as DbCredentialRow[]).map((row) => ({
            id: row.id,
            certName: row.cert_name,
            issueDate: row.issue_date ?? "",
            fileName: row.document_url?.split("/").pop() ?? "file",
            previewUrl: row.signedUrl,
            isImage: /\.(png|jpe?g|gif|webp)$/i.test(row.document_url ?? ""),
            isPublic: row.is_public,
          }))
        );
        setIsReal(true);
      })
      .catch(() => {
        // No project configured / not authenticated — stick with local-only uploads.
      });
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
  };

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingFile || !certName) return;
    setNotice(null);
    const isImage = pendingFile.type.startsWith("image/");
    const localCredential: Credential = {
      id: crypto.randomUUID(),
      certName,
      issueDate,
      fileName: pendingFile.name,
      previewUrl: isImage ? URL.createObjectURL(pendingFile) : null,
      isImage,
      isPublic: false,
    };

    if (isReal) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.set("file", pendingFile);
        formData.set("certName", certName);
        formData.set("issueDate", issueDate);
        const res = await fetch("/api/credentials", { method: "POST", body: formData });
        const body = await res.json();
        if (!res.ok) {
          setNotice(body.error ?? "Couldn't upload to your vault — kept locally instead.");
          setCredentials((prev) => [localCredential, ...prev]);
        } else {
          const row: DbCredentialRow = body.credential;
          setCredentials((prev) => [
            {
              id: row.id,
              certName: row.cert_name,
              issueDate: row.issue_date ?? "",
              fileName: pendingFile.name,
              previewUrl: row.signedUrl,
              isImage,
              isPublic: row.is_public,
            },
            ...prev,
          ]);
        }
      } catch {
        setNotice("Couldn't reach the server — kept locally instead.");
        setCredentials((prev) => [localCredential, ...prev]);
      } finally {
        setUploading(false);
      }
    } else {
      setCredentials((prev) => [localCredential, ...prev]);
    }

    setCertName("");
    setIssueDate("");
    setPendingFile(null);
    (e.target as HTMLFormElement).reset();
  };

  const togglePublic = async (id: string) => {
    const target = credentials.find((c) => c.id === id);
    if (!target) return;
    const nextIsPublic = !target.isPublic;
    setCredentials((prev) => prev.map((c) => (c.id === id ? { ...c, isPublic: nextIsPublic } : c)));

    if (isReal) {
      await fetch("/api/credentials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublic: nextIsPublic }),
      }).catch(() => {
        // best-effort — the optimistic UI update stands either way
      });
    }
  };

  const remove = (id: string) => setCredentials((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          {isReal
            ? "Signed in — uploads go to your account's private storage; the public toggle is real too."
            : "Not connected to a real account here, so uploads stay local to this browser session."}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Badge variant={isReal ? "default" : "locked"}>{isReal ? "Your data" : "Sample data"}</Badge>
      </div>

      <Card>
        <CardContent className="p-5">
          <form onSubmit={upload} className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium text-muted-foreground">Credential name</span>
              <input
                required
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder="AHA CPR / AED for Healthcare Providers"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-muted-foreground">Issue date</span>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-muted-foreground">File (PDF, JPG, PNG)</span>
              <input
                required
                type="file"
                accept="application/pdf,image/*"
                onChange={onFileSelect}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none file:mr-2 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground"
              />
            </label>
            {notice && <p className="text-sm text-muted-foreground sm:col-span-2">{notice}</p>}
            <Button type="submit" disabled={uploading} className="w-fit gap-2 sm:col-span-2">
              <UploadCloud className="h-4 w-4" /> {uploading ? "Uploading..." : "Add to vault"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {credentials.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card>
                <CardContent className="flex flex-col gap-3 p-5">
                  {c.isImage && c.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.previewUrl}
                      alt={c.certName}
                      className="h-32 w-full rounded-md border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center rounded-md border border-border bg-muted/40">
                      <FileText className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
                    </div>
                  )}
                  <div>
                    <p className="font-display text-base font-bold leading-snug">{c.certName}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.fileName} {c.issueDate && `· issued ${c.issueDate}`}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => togglePublic(c.id)}>
                      {c.isPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      {c.isPublic ? "Public badge" : "Private"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(c.id)} aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {c.isPublic && <Badge variant="accent">Shareable on your public portfolio</Badge>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {credentials.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nothing uploaded yet — add a CPR card, transcript, or license PDF above.
        </p>
      )}
    </div>
  );
}
