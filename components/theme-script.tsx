import { THEME_STORAGE_KEY } from "@/components/theme-provider";

const THEME_INITIALIZER = `(() => {
  const storageKey = "${THEME_STORAGE_KEY}";
  const preferDarkQuery = "(prefers-color-scheme: dark)";
  const root = document.documentElement;

  const apply = (theme) => {
    if (theme !== "light" && theme !== "dark") {
      return;
    }

    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
  };

  try {
    const storedTheme = localStorage.getItem(storageKey);

    if (storedTheme === "light" || storedTheme === "dark") {
      apply(storedTheme);
      return;
    }
  } catch {
    // Ignore storage errors (e.g., restricted access)
  }

  let prefersDark = false;

  try {
    if (typeof window.matchMedia === "function") {
      prefersDark = window.matchMedia(preferDarkQuery).matches;
    } else {
      // Fallback to the app's default theme when matchMedia is unavailable
      apply("dark");
      return;
    }
  } catch {
    // If querying matchMedia fails, fallback to the app's default theme
    apply("dark");
    return;
  }

  apply(prefersDark ? "dark" : "light");
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INITIALIZER }} />;
}
