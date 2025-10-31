import { useEffect, useState } from "react";
export type Theme = "light" | "dark";

export function useTheme() {
  const getInitial = (): Theme => {
    try {
      const saved = localStorage.getItem("theme") as Theme | null;
      if (saved === "dark" || saved === "light") return saved;
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      )
        return "dark";
    } catch {}
    return "light";
  };

  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  return { theme, setTheme };
}
