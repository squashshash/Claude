import { Info, ShieldCheck, Syringe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LiabilityHub() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          This is educational context from the real federal regulations that govern student clinical
          shadowing — not legal advice, and not a substitute for whatever forms your host facility
          gives you.
          <Badge variant="outline" className="ml-2 shrink-0">
            Not a waiver generator
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
            <CardTitle>HIPAA and shadowing</CardTitle>
          </div>
          <CardDescription>HIPAA Privacy Rule, 45 CFR § 164.501 and § 160.103</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            Student clinical shadowing generally falls under HIPAA&apos;s definition of{" "}
            <span className="font-semibold text-foreground">&ldquo;health care operations&rdquo;</span> — training
            programs where students learn under supervision. That means facilities usually don&apos;t
            need to get individual patient authorization just for you to observe.
          </p>
          <p>
            You&apos;re treated as part of the facility&apos;s{" "}
            <span className="font-semibold text-foreground">workforce</span> for HIPAA purposes — the
            facility is required to give you basic privacy orientation and typically has you sign a
            confidentiality agreement before you get clinical access.
          </p>
          <p>
            Facilities can restrict what you see to the{" "}
            <span className="font-semibold text-foreground">minimum necessary</span> for the
            observation — don&apos;t expect (or ask for) full chart access.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-accent" aria-hidden="true" />
            <CardTitle>Bloodborne pathogens & safety</CardTitle>
          </div>
          <CardDescription>OSHA Bloodborne Pathogens Standard, 29 CFR 1910.1030</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            As a minor observer, you should be strictly{" "}
            <span className="font-semibold text-foreground">passive observation only</span> — no
            handling sharps, no assisting with patient transfers, no biohazard waste handling.
          </p>
          <p>
            If you&apos;ll be anywhere splatter or exposure is possible, the facility has to provide
            PPE (mask, eye protection, gloves) at no cost to you.
          </p>
          <p>
            Most programs require proof of a negative TB screening (PPD or IGRA) and a completed
            Hepatitis B vaccination series (or a signed declination) before granting clinical access —
            plan ahead, this can take weeks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
