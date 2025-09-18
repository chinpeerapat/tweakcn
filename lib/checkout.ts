import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "tweak-ai-theme";

const getThemeMode = (): ThemeMode => {
  if (typeof document !== "undefined") {
    const { classList } = document.documentElement;

    if (classList.contains("dark")) {
      return "dark";
    }

    if (classList.contains("light")) {
      return "light";
    }
  }

  if (typeof window !== "undefined") {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);

    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }
  }

  return "light";
};

export const openCheckout = async (link: string) => {
  const mode = getThemeMode();

  try {
    // This creates the checkout iframe and returns a Promise
    // that resolves when the checkout is fully loaded
    const checkout = await PolarEmbedCheckout.create(link, mode);

    // Now you can interact with the checkout instance
    return checkout;
  } catch (error) {
    console.error("Failed to open checkout", error);
  }
};
