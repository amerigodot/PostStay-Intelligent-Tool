import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Database, 
  KeyRound, 
  FileCheck2, 
  ArrowRight, 
  EyeOff, 
  UserCheck,
  Server,
  Layers,
} from 'lucide-react';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';

interface PrivacyArchitectureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyArchitectureModal({ open, onOpenChange }: PrivacyArchitectureModalProps) {
  const { privacyMode } = useHospitalityData();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-serif">
                  Privacy-by-Design & Identity Vault Architecture
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Architectural Pseudonymization & Zero-PII AI Governance for Distinguished Hospitality
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-emerald-600/40 text-emerald-700 dark:text-emerald-400 text-xs">
              GDPR Article 25 & 32 Compliant
            </Badge>
          </div>
        </DialogHeader>

        {/* Pipeline Diagram */}
        <div className="space-y-6 pt-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-primary" />
              Four-Stage Zero-Knowledge Feedback Lifecycle
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Step 1 */}
              <div className="rounded-lg border p-3 bg-card relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      STAGE 01
                    </span>
                    <Server className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h5 className="font-semibold text-xs text-foreground mb-1">PMS Checkout Event</h5>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Opera/Mews webhook triggers checkout. Raw guest PII is ingested exclusively through an ephemeral TLS 1.3 socket.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t text-[10px] text-primary flex items-center gap-1 font-mono">
                  <span>PII Ingestion</span>
                  <ArrowRight className="h-3 w-3 ml-auto" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-lg border border-primary/30 p-3 bg-primary/5 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary font-semibold">
                      STAGE 02
                    </span>
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <h5 className="font-semibold text-xs text-foreground mb-1">Identity Vault Tokenization</h5>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Name, email, and passport are sealed in an isolated vault. A salted cryptographic hash generates <code className="text-primary font-mono">guest_key</code>.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t text-[10px] text-primary flex items-center gap-1 font-mono">
                  <span>Salted Hash (SHA-256)</span>
                  <ArrowRight className="h-3 w-3 ml-auto" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-lg border p-3 bg-card relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      STAGE 03
                    </span>
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h5 className="font-semibold text-xs text-foreground mb-1">Zero-PII AI Engine</h5>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Only text sentiment, themes (e.g. #riva-transfer, #acoustics), and stay attributes are analyzed. No raw identity ever touches LLMs.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t text-[10px] text-primary flex items-center gap-1 font-mono">
                  <span>Theme & Vector Scoring</span>
                  <ArrowRight className="h-3 w-3 ml-auto" />
                </div>
              </div>

              {/* Step 4 */}
              <div className="rounded-lg border p-3 bg-card relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      STAGE 04
                    </span>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h5 className="font-semibold text-xs text-foreground mb-1">Human-in-the-Loop</h5>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Staff reviews AI drafted responses in their console. Vault re-attaches destination channel on outbound dispatch with audit proof.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t text-[10px] text-primary flex items-center gap-1 font-mono">
                  <span>Audit Trail Logged</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Separation Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 bg-muted/20 space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <h5 className="font-semibold text-xs">Identity Vault (PII Vault)</h5>
              </div>
              <ul className="text-xs space-y-1.5 text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Zero External Access:</strong> Fully air-gapped database containing raw guest identifiers.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Granular Article 17 Erasure:</strong> Purging a vault key renders all operational feedback forever anonymous.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Tamper-Evident Ledger:</strong> Every staff inspection is cryptographically logged.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border p-4 bg-muted/20 space-y-2">
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-emerald-600" />
                <h5 className="font-semibold text-xs">Operational & AI Database</h5>
              </div>
              <ul className="text-xs space-y-1.5 text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Pure Pseudonymity:</strong> Guests referred strictly as <code className="text-xs font-mono">GK-VDE-8491A</code>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Semiotics of Discretion:</strong> Staff view honors luxury discretion without exposing sensitive personal contacts.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Current Active Mode:</strong> <span className="font-semibold uppercase text-foreground">{privacyMode}</span>.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-border p-3 text-xs bg-muted/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">
                Interactive Verification Available
              </span>
            </div>
            <span className="text-muted-foreground">
              Toggle the PII Shield button in the navigation bar to test live pseudonymization.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
