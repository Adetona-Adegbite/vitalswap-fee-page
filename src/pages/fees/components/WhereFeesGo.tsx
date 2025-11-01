import React, { useEffect, useState } from "react";
import {
  FiGlobe,
  FiShuffle,
  FiBarChart2,
  FiMail,
  FiSun,
  FiMoon,
} from "react-icons/fi";

export default function WhereFeesGo() {
  // Theme state + persistence + Ctrl/Cmd+J shortcut
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch {}
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
        setTheme((t) => (t === "dark" ? "light" : "dark"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="text-left">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2"
              style={{ fontFamily: "Gilroy, sans-serif" }}
            >
              Where Your Fees Go
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-300 max-w-xl">
              A transparent breakdown of how fees are distributed across the
              platform — liquidity, sustainability and operations.
            </p>
          </div>

          {/* theme toggle */}
          {/* <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme (Ctrl/Cmd + J)"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-slate-100 shadow-sm hover:opacity-90 transition"
            >
              {theme === "dark" ? (
                <FiSun className="w-4 h-4" />
              ) : (
                <FiMoon className="w-4 h-4" />
              )}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </div> */}
        </div>

        {/* Fee Distribution Diagram */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center font-bold text-xl"
                  style={{
                    background:
                      theme === "dark"
                        ? "linear-gradient(135deg,#0ea5a4,#0369a1)"
                        : "linear-gradient(135deg,#2563eb,#06b6d4)",
                    color: "white",
                  }}
                >
                  100%
                </div>
                {/* <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 dark:text-slate-300 font-medium">
                  Your Fees
                </div> */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {/* Liquidity Providers */}
              <div className="text-center">
                <div className="relative mb-4">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-sm"
                    style={{
                      background:
                        theme === "dark"
                          ? "linear-gradient(135deg,#f59e0b,#f97316)"
                          : "linear-gradient(135deg,#3b82f6,#06b6d4)",
                      color: theme === "dark" ? "#0b1220" : "white",
                    }}
                  >
                    60%
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                    style={{
                      background: theme === "dark" ? "#06b6d4" : "#fde68a",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                  />
                </div>
                <h3
                  className="font-bold text-gray-900 dark:text-slate-100 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  60% Liquidity Providers
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  Ensuring seamless liquidity
                </p>
              </div>

              {/* Platform Sustainability */}
              <div className="text-center">
                <div className="relative mb-4">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-sm"
                    style={{
                      background:
                        theme === "dark"
                          ? "linear-gradient(135deg,#f59e0b,#f97316)"
                          : "linear-gradient(135deg,#f59e0b,#fcd34d)",
                      color: theme === "dark" ? "#041124" : "#071023",
                    }}
                  >
                    30%
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                    style={{
                      background: theme === "dark" ? "#0369a1" : "#3b82f6",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                  />
                </div>
                <h3
                  className="font-bold text-gray-900 dark:text-slate-100 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  30% Platform Sustainability
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  Development and security
                </p>
              </div>

              {/* Operations */}
              <div className="text-center">
                <div className="relative mb-4">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-sm"
                    style={{
                      background:
                        theme === "dark"
                          ? "linear-gradient(135deg,#60a5fa,#38bdf8)"
                          : "linear-gradient(135deg,#60a5fa,#7dd3fc)",
                      color: theme === "dark" ? "#021226" : "white",
                    }}
                  >
                    10%
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                    style={{
                      background: theme === "dark" ? "#f97316" : "#fcd34d",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                  />
                </div>
                <h3
                  className="font-bold text-gray-900 dark:text-slate-100 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  10% Operations
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  Customer support & compliance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How fees & rates work */}
        <div className="mt-6">
          <h3
            className="text-2xl font-bold text-gray-900 dark:text-slate-100 text-center mb-8"
            style={{ fontFamily: "Gilroy, sans-serif" }}
          >
            How fees & rates work
          </h3>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-lg p-6 flex gap-4 items-start border shadow-sm"
              style={{
                // background: theme === "dark" ? "#0f1724" : "white",
                borderColor: theme === "dark" ? "#0b1220" : "#e5e7eb",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg grid place-items-center text-xl"
                style={{
                  // background: theme === "dark" ? "#0b1220" : "#f8fafc",
                  color: theme === "dark" ? "#06b6d4" : "#2563eb",
                }}
              >
                <FiGlobe />
              </div>
              <div>
                <div
                  className="font-semibold text-gray-900 dark:text-slate-100"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Rate source
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                  Live FX rates are pulled from our exchange feed. Rates refresh
                  periodically — use the refresh control on the FX card to fetch
                  the latest.
                </p>
              </div>
            </div>

            <div
              className="rounded-lg p-6 flex gap-4 items-start border shadow-sm"
              style={{
                // background: theme === "dark" ? "#0f1724" : "white",
                borderColor: theme === "dark" ? "#0b1220" : "#e5e7eb",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg grid place-items-center text-xl"
                style={{
                  // background: theme === "dark" ? "#0b1220" : "#f8fafc",
                  color: theme === "dark" ? "#f59e0b" : "#f59e0b",
                }}
              >
                <FiShuffle />
              </div>
              <div>
                <div
                  className="font-semibold text-gray-900 dark:text-slate-100"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  What affects fees
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                  Fees vary by product, rails and route (NGN vs USD). Some
                  services include a spread, fixed charge, or both — open a card
                  to see per-service details.
                </p>
              </div>
            </div>

            <div
              className="rounded-lg p-6 flex gap-4 items-start border shadow-sm"
              style={{
                // background: theme === "dark" ? "#0f1724" : "white",
                borderColor: theme === "dark" ? "#0b1220" : "#e5e7eb",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg grid place-items-center text-xl"
                style={{
                  // background: theme === "dark" ? "#021226" : "#ecfeff",
                  color: theme === "dark" ? "#34d399" : "#059669",
                }}
              >
                <FiBarChart2 />
              </div>
              <div>
                <div
                  className="font-semibold text-gray-900 dark:text-slate-100"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Supported currencies
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                  We surface USD, NGN, EUR, GBP. Need more currencies or a
                  specific quote? Reach out and we’ll add them.
                </p>
              </div>
            </div>

            <div
              className="rounded-lg p-6 flex gap-4 items-start border shadow-sm"
              style={{
                // background: theme === "dark" ? "#0f1724" : "white",
                borderColor: theme === "dark" ? "#0b1220" : "#e5e7eb",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg grid place-items-center text-xl"
                style={{
                  // background: theme === "dark" ? "#0b1220" : "#fff1f2",
                  color: theme === "dark" ? "#fb7185" : "#db2777",
                }}
              >
                <FiMail />
              </div>
              <div>
                <div
                  className="font-semibold text-gray-900 dark:text-slate-100"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Support & integration
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                  Questions or want this data in your dashboard? Email{" "}
                  <a
                    href="mailto:contact@vitalswap.com"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    contact@vitalswap.com
                  </a>{" "}
                  or add the API endpoint to your integrations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: theme === "dark" ? "#061124" : "#ebf8ff" }}
              >
                <i
                  className="ri-shield-check-line text-2xl"
                  style={{ color: theme === "dark" ? "#60a5fa" : "#2563eb" }}
                ></i>
              </div>
              <h4
                className="font-bold text-gray-900 dark:text-slate-100 mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Audited by Certik
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Security verified by industry leaders
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: theme === "dark" ? "#201206" : "#fffbeb" }}
              >
                <i
                  className="ri-lock-line text-2xl"
                  style={{ color: theme === "dark" ? "#f59e0b" : "#f59e0b" }}
                ></i>
              </div>
              <h4
                className="font-bold text-gray-900 dark:text-slate-100 mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                SSL Secured
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Bank-grade encryption protection
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: theme === "dark" ? "#061124" : "#ebf8ff" }}
              >
                <i
                  className="ri-group-line text-2xl"
                  style={{ color: theme === "dark" ? "#60a5fa" : "#2563eb" }}
                ></i>
              </div>
              <h4
                className="font-bold text-gray-900 dark:text-slate-100 mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Trusted by 10,000+ users
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Growing community of traders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
