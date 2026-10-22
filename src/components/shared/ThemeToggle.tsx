import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        className="h-9 w-9 border-border bg-card text-foreground hover:bg-muted shadow-xs shrink-0"
        disabled
      >
        <Sun className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="h-9 w-9 border-border bg-card text-foreground hover:bg-muted shadow-xs transition-colors shrink-0"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400 hover:text-amber-300 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-slate-700 hover:text-slate-900 transition-transform duration-300 hover:-rotate-12" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </TooltipContent>
    </Tooltip>
  );
}
