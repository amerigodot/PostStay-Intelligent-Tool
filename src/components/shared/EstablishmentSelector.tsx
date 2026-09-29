import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Building2, ChevronDown, Check, Globe2 } from 'lucide-react';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';

export function EstablishmentSelector() {
  const { properties, selectedPropertyId, setSelectedPropertyId, activeProperty } = useHospitalityData();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 h-9 text-xs font-semibold border-border bg-card hover:bg-muted text-foreground shadow-xs transition-colors"
        >
          {selectedPropertyId === 'all' ? (
            <>
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
                <Globe2 className="h-3.5 w-3.5" />
              </div>
              <span className="hidden sm:inline font-bold">Unified Portfolio</span>
              <span className="sm:hidden font-bold">All Estates</span>
              <span className="text-[11px] text-muted-foreground hidden md:inline">({properties.length})</span>
            </>
          ) : (
            <>
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <span className="truncate max-w-[140px] md:max-w-[180px] font-bold">
                {activeProperty?.name}
              </span>
            </>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72 p-1.5 shadow-md">
        <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold px-2 py-1">
          Select Distinguished Property
        </DropdownMenuLabel>
        
        <DropdownMenuItem 
          onClick={() => setSelectedPropertyId('all')}
          className={`flex items-center justify-between p-2 rounded-md text-xs cursor-pointer transition-colors ${
            selectedPropertyId === 'all' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`flex h-6 w-6 items-center justify-center rounded ${
              selectedPropertyId === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <Globe2 className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Unified Luxury Portfolio</div>
              <div className="text-[10px] text-muted-foreground">Aggregated KPIs across all 5 estates</div>
            </div>
          </div>
          {selectedPropertyId === 'all' && <Check className="h-4 w-4 text-primary shrink-0" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        {properties.map(prop => {
          const isSelected = selectedPropertyId === prop.id;
          return (
            <DropdownMenuItem
              key={prop.id}
              onClick={() => setSelectedPropertyId(prop.id)}
              className={`flex items-center justify-between p-2 rounded-md text-xs cursor-pointer transition-colors ${
                isSelected ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Building2 className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-foreground truncate">{prop.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {prop.location}
                  </div>
                </div>
              </div>
              {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-2" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
