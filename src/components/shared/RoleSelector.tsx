import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Megaphone, 
  Settings, 
  ChevronDown, 
  Check, 
  UserCheck,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { roleLabels, availableRoles, UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';

const roleMeta: Record<UserRole, { icon: React.ComponentType<{ className?: string }>; desc: string; badge: string }> = {
  receptionist: { 
    icon: Users, 
    desc: 'Front desk arrivals, guest directory & upsell prompts', 
    badge: 'Front Desk' 
  },
  'guest-relations': { 
    icon: MessageSquare, 
    desc: 'Feedback triage, AI response co-pilot & escalation', 
    badge: 'Guest Relations' 
  },
  manager: { 
    icon: BarChart3, 
    desc: 'Executive KPIs, sentiment trajectories & benchmarks', 
    badge: 'Executive GM' 
  },
  marketing: { 
    icon: Megaphone, 
    desc: 'GDPR consent matrix & tokenized segment builder', 
    badge: 'Marketing & Loyalty' 
  },
  admin: { 
    icon: Settings, 
    desc: 'Tamper-evident audit ledger & PMS connector telemetry', 
    badge: 'DPO & Compliance' 
  },
};

const roleRouteMap: Record<UserRole, string> = {
  receptionist: '/receptionist',
  'guest-relations': '/guest-relations',
  marketing: '/marketing',
  manager: '/manager',
  admin: '/admin',
};

export function RoleSelector() {
  const { currentRole, setRole } = useRole();
  const navigate = useNavigate();

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    navigate(roleRouteMap[role]);
  };

  const currentMeta = roleMeta[currentRole];
  const CurrentIcon = currentMeta.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 h-9 text-xs font-semibold border-border bg-card hover:bg-muted text-foreground shadow-xs transition-colors"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
            <CurrentIcon className="h-3.5 w-3.5" />
          </div>
          <span className="hidden sm:inline font-bold">
            {roleLabels[currentRole]}
          </span>
          <span className="sm:hidden font-bold">
            {currentMeta.badge}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72 p-1.5 shadow-md">
        <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold px-2 py-1">
          Switch Operator Console Persona
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />

        {availableRoles.map(role => {
          const meta = roleMeta[role];
          const Icon = meta.icon;
          const isSelected = currentRole === role;

          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`flex items-start justify-between p-2 rounded-md text-xs cursor-pointer transition-colors ${
                isSelected ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    {roleLabels[role]}
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                    {meta.desc}
                  </div>
                </div>
              </div>
              {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-2 mt-1" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
