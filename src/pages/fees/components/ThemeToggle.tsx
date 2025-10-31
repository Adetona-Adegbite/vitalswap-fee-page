import React, { useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [theme, setTheme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      aria-pressed={theme === "dark"}
      className={`
        relative w-10 h-10 rounded-full flex items-center justify-center
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-800
        text-gray-700 dark:text-yellow-400
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-all duration-300 ease-in-out
        shadow-sm hover:shadow-md
      `}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === "dark" ? (
        <FiSun className="w-5 h-5" />
      ) : (
        <FiMoon className="w-5 h-5" />
      )}
    </button>
  );
}
