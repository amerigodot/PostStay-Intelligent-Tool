import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Send, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Building2,
  Volume2,
  TreePine,
  Ship,
} from 'lucide-react';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';

interface SimulateReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SimulateReviewDialog({ open, onOpenChange }: SimulateReviewDialogProps) {
  const { simulateIncomingReview } = useHospitalityData();
  const [selectedPreset, setSelectedPreset] = useState<'promoter-riva' | 'acoustic-friction' | 'spa-bliss'>('promoter-riva');

  const handleSimulate = () => {
    simulateIncomingReview(selectedPreset);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary animate-pulse" />
            <DialogTitle className="text-lg font-serif">
              Simulate PMS Checkout Micro-Survey
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Inject a real-time guest review into the operational queue to test automated sentiment classification and AI drafting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Preset 1: Riva Sunset Rave */}
          <div 
            onClick={() => setSelectedPreset('promoter-riva')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedPreset === 'promoter-riva'
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border hover:bg-muted/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Ship className="h-3.5 w-3.5 text-primary" />
                Villa d'Este • Riva Sunset Charter
              </span>
              <Badge className="bg-emerald-600 text-white text-[10px]">NPS 10 • Promoter</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Contessa Beatrice reviews private Riva speedboat excursion to Bellagio with Bellini cocktails.
            </p>
          </div>

          {/* Preset 2: Acoustic Friction */}
          <div 
            onClick={() => setSelectedPreset('acoustic-friction')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedPreset === 'acoustic-friction'
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border hover:bg-muted/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5 text-amber-600" />
                Villa d'Este • Acoustic Disruption
              </span>
              <Badge className="bg-destructive text-destructive-foreground text-[10px]">NPS 4 • Detractor</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Lord Cavendish reports morning groundskeeping blowers at 07:20 outside Queen Pavilion terrace.
            </p>
          </div>

          {/* Preset 3: Forestis Spa Bliss */}
          <div 
            onClick={() => setSelectedPreset('spa-bliss')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedPreset === 'spa-bliss'
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border hover:bg-muted/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <TreePine className="h-3.5 w-3.5 text-emerald-700" />
                Forestis Dolomites • Alpine Silence
              </span>
              <Badge className="bg-emerald-600 text-white text-[10px]">NPS 10 • Promoter</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Dr. von Bernstorff praises the Celtic tree sauna infusion ritual and pure spring water.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t pt-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSimulate} className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Dispatch Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
