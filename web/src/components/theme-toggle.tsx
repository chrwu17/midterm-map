"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/** The theme currently showing: an explicit choice on <html>, else the system setting. */
function currentTheme(): Theme {
  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  if (root.classList.contains("light")) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Light/dark switch. With no saved choice the site follows the system setting. Clicking saves an explicit
 * choice in localStorage (wrapped in try/catch: storage can be blocked) and applies it on <html>.
 * The saved choice is applied before first paint by the inline script in layout.tsx.
 */
const EVENT = "themechange";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

export function ThemeToggle() {
  // null on the server and during hydration, then the real theme: the button shows no icon until it is known.
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage blocked: the choice still applies for this visit */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  const label = theme === "dark" ? "Switch to light mode" : theme === "light" ? "Switch to dark mode" : "Switch color mode";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="press inline-flex size-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
    >
      {theme === "dark" ? <Sun className="size-5" aria-hidden="true" /> : theme === "light" ? <Moon className="size-5" aria-hidden="true" /> : null}
    </button>
  );
}
