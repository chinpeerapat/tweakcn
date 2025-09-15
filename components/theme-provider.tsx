"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type Coords = { x: number; y: number };

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: (coords?: Coords) => void;
};

const STORAGE_KEY = "tweak-ai-theme";

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (storedTheme === "light" || storedTheme === "dark") {
      setThemeState(storedTheme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setThemeState(prefersDark ? "dark" : defaultTheme);
  }, [defaultTheme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const handleToggleTheme = (coords?: Coords) => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";

    if (typeof window === "undefined" || typeof document === "undefined") {
      setThemeState(nextTheme);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { startViewTransition } = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };

    if (!startViewTransition || prefersReducedMotion) {
      setThemeState(nextTheme);
      return;
    }

    if (coords) {
      const root = document.documentElement;
      root.style.setProperty("--x", `${coords.x}px`);
      root.style.setProperty("--y", `${coords.y}px`);
    }

    startViewTransition(() => {
      setThemeState(nextTheme);
    });
  };

  return (
    <ThemeProviderContext.Provider
      value={{ theme, setTheme: handleSetTheme, toggleTheme: handleToggleTheme }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
