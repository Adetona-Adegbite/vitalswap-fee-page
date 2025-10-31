// src/components/OnboardingModal.tsx
import React, { useEffect, useState } from "react";
import { FiCommand, FiX } from "react-icons/fi";
import { FaKeyboard } from "react-icons/fa";

/**
 * OnboardingModal
 * - Shows every page load (per request)
 * - Encourages shortcuts only (no toggle buttons)
 * - Auto-fades after `visibleMs` then unmounts
 * - Dispatches `vitalswap:open-copilot` and `vitalswap:toggle-theme` on shortcuts
 *
 * Props:
 *  - visibleMs: how long the modal stays visible before fade starts (ms)
 *  - fadeMs: duration of fade-out (ms)
 */
type Props = {
  visibleMs?: number;
  fadeMs?: number;
};

export default function OnboardingModal({
  visibleMs = 6000,
  fadeMs = 900,
}: Props) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  // keyboard shortcuts -> broadcast events
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      const k = e.key.toLowerCase();
      if (k === "k") {
        window.dispatchEvent(new CustomEvent("vitalswap:open-copilot"));
        e.preventDefault();
      } else if (k === "j") {
        window.dispatchEvent(new CustomEvent("vitalswap:toggle-theme"));
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // auto-fade lifecycle
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => setFading(true), visibleMs);
    const t2 = window.setTimeout(() => setVisible(false), visibleMs + fadeMs);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [visibleMs, fadeMs, visible]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to VitalSwap — keyboard shortcuts and accessibility"
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8`}
    >
      {/* backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          fading ? "opacity-0" : "opacity-80"
        } bg-black/40 backdrop-blur-sm`}
        aria-hidden
      />

      {/* card */}
      <div
        className={`relative max-w-3xl w-full mx-auto transform transition-all ease-out ${
          fading
            ? "opacity-0 translate-y-4 scale-0.995"
            : "opacity-100 translate-y-0 scale-100"
        }`}
        style={{ transitionDuration: `${fadeMs}ms` }}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
            {/* left graphic */}
            {/* <div className="flex-shrink-0 flex items-center justify-center">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-xl grid place-items-center"
                style={{
                  background:
                    "linear-gradient(135deg,var(--tw-gradient-stops))",
                }}
              >
                <div
                  className="w-16 h-16 rounded-lg grid place-items-center text-white font-extrabold text-lg"
                  style={{
                    background: "linear-gradient(135deg,#06b6d4,#7c3aed)",
                    boxShadow: "0 6px 20px rgba(16,24,40,0.12)",
                  }}
                >
                  A11Y
                </div>
              </div> */}
            {/* </div> */}

            {/* content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    className="text-lg md:text-2xl font-semibold leading-tight text-slate-900 dark:text-slate-100"
                    style={{ fontFamily: "Gilroy, sans-serif" }}
                  >
                    Accessibility & Shortcuts
                  </h2>
                  <p
                    className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-xl"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Try the keyboard shortcuts below to interact quickly — no
                    menus required. This overlay auto-fades but will appear
                    again on next load.
                  </p>
                </div>

                {/* close */}
                <button
                  onClick={() => setVisible(false)}
                  aria-label="Dismiss"
                  className="ml-auto -mt-1 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-500 dark:text-slate-300"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* shortcut cards */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-2">
                      <FaKeyboard className="w-5 h-5 text-slate-700 dark:text-slate-100" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Copilot (in-page)
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        Press{" "}
                        <kbd className="inline-flex items-center px-2 py-1 text-xs bg-white border rounded dark:bg-slate-900 dark:text-slate-100">
                          Ctrl/Cmd + K
                        </kbd>{" "}
                        to open the page copilot and ask questions about this
                        page.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-2">
                      <FiCommand className="w-5 h-5 text-slate-700 dark:text-slate-100" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Theme Shortcut
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        Press{" "}
                        <kbd className="inline-flex items-center px-2 py-1 text-xs bg-white border rounded dark:bg-slate-900 dark:text-slate-100">
                          Ctrl/Cmd + J
                        </kbd>{" "}
                        to toggle dark ↔ light.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 col-span-full">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-2 mt-0.5">
                      <FaKeyboard className="w-5 h-5 text-slate-700 dark:text-slate-100" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Quick tips
                      </div>
                      <ul className="text-xs text-slate-600 dark:text-slate-300 mt-2 space-y-1">
                        <li>
                          • The copilot is trained on the page content — ask it
                          product or fee questions.
                        </li>
                        <li>
                          • All interactive elements keep keyboard focus and
                          accessible labels.
                        </li>
                        <li>
                          • Animations respect user preferences; reduced-motion
                          supported.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 text-xs text-slate-500 dark:text-slate-400">
                Tip: press the shortcuts now to try them — Ctrl/Cmd+K opens
                copilot, Ctrl/Cmd+J toggles theme.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
