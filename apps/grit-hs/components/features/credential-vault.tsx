"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Trash2, Globe, Lock } from "lucide-react";
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

export function CredentialVault() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [certName, setCertName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
  };

  const upload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingFile || !certName) return;
    const isImage = pendingFile.type.startsWith("image/");
    setCredentials((prev) => [
      {
        id: crypto.randomUUID(),
        certName,
        issueDate,
        fileName: pendingFile.name,
        previewUrl: isImage ? URL.createObjectURL(pendingFile) : null,
        isImage,
        isPublic: false,
      },
      ...prev,
    ]);
    setCertName("");
    setIssueDate("");
    setPendingFile(null);
    (e.target as HTMLFormElement).reset();
  };

  const togglePublic = (id: string) =>
    setCredentials((prev) => prev.map((c) => (c.id === id ? { ...c, isPublic: !c.isPublic } : c)));

  const remove = (id: string) => setCredentials((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="flex flex-col gap-6">
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
            <Button type="submit" className="w-fit gap-2 sm:col-span-2">
              <UploadCloud className="h-4 w-4" /> Add to vault
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
