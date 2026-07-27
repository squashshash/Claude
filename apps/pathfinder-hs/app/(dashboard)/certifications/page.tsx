import { Card, CardContent } from "@/components/ui/card";

export default function CertificationsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold">Certifications & Vault</h1>
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Age-requirement engine and Digital Credential Vault (Module 3) — wired up in Phase 3
          against the <code>certifications</code> and <code>user_credentials</code> tables.
        </CardContent>
      </Card>
    </div>
  );
}
