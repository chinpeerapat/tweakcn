"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { TooltipWrapper } from "./tooltip-wrapper";

interface ThemeToggleProps extends React.ComponentProps<typeof Button> {}

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  return (
    <TooltipWrapper label="Toggle theme" asChild>
      <Button
        type="button"
        aria-label="Toggle color theme"
        aria-pressed={theme === "dark"}
        title="Toggle color theme"
        className={cn("cursor-pointer", className)}
        {...props}
        onClick={handleThemeToggle}
      >
        <span className="sr-only">{theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}</span>
        {theme === "light" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
      </Button>
    </TooltipWrapper>
  );
}
