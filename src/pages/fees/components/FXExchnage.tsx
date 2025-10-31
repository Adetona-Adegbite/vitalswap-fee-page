import React, { useState } from "react";
import {
  FiRepeat,
  FiArrowRight,
  FiLoader,
  FiChevronDown,
  FiRefreshCw,
} from "react-icons/fi";

const API_KEY = import.meta.env.VITE_FX_API_KEY;

const currencySymbols: Record<string, string> = {
  USD: "$",
  NGN: "₦",
  EUR: "€",
  GBP: "£",
};

const formatCurrency = (value: number, currency: string) => {
  if (!Number.isFinite(value)) return "-";
  const symbol = currencySymbols[currency] ?? "";
  return `${symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const onKeyDownNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
};

const Chip: React.FC<{ code: string }> = ({ code }) => (
  <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-chip dark:bg-chip-dark border border-chip-border dark:border-chip-border-dark shadow-xs">
    <div className="w-7 h-7 rounded-full bg-chip-icon dark:bg-chip-icon-dark grid place-items-center text-xs font-semibold text-white">
      {code.slice(0, 2)}
    </div>
    <div className="text-sm font-medium text-slate-700 dark:text-slate-100">
      {code}
    </div>
  </div>
);

const VITALSWAP_URL = (from: string, to: string) =>
  `https://2kbbumlxz3.execute-api.us-east-1.amazonaws.com/default/exchange?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;

export default function ExchangeCalculator() {
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("NGN");
  const [amount, setAmount] = useState<string>("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [converted, setConverted] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const valid = !!from && !!to && Number(amount) > 0 && from !== to;

  const swap = () => {
    setFrom((f) => {
      setTo(f);
      return to;
    });
  };

  const calculate = async () => {
    setError(null);
    setRate(null);
    setConverted(null);
    setLastUpdated(null);

    const amt = parseFloat(amount);
    if (Number.isNaN(amt) || amt <= 0) {
      setError("Enter a valid amount > 0.");
      return;
    }
    if (!from || !to) {
      setError("Select both currencies.");
      return;
    }
    if (from === to) {
      setError("Choose two different currencies (or swap).");
      return;
    }

    setLoading(true);
    try {
      const useVital =
        (from.toUpperCase() === "USD" && to.toUpperCase() === "NGN") ||
        (from.toUpperCase() === "NGN" && to.toUpperCase() === "USD");

      const url = useVital
        ? VITALSWAP_URL(from, to)
        : `https://api.exchangerate.host/convert?access_key=${API_KEY}&from=${encodeURIComponent(
            from
          )}&to=${encodeURIComponent(to)}&amount=${amt}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Exchange API responded ${res.status}`);
      const data = await res.json();

      const fetchedRate = useVital
        ? data?.rate ?? data?.Rate ?? null
        : data?.info?.quote ?? null;

      if (fetchedRate == null) {
        throw new Error(
          "Unexpected response from exchange API (missing rate)."
        );
      }

      const numericRate =
        typeof fetchedRate === "number"
          ? fetchedRate
          : parseFloat(String(fetchedRate));
      if (!Number.isFinite(numericRate))
        throw new Error("Invalid rate returned from exchange API.");

      const convertedValue = useVital
        ? Math.round((amt * numericRate + Number.EPSILON) * 100) / 100
        : data?.result ?? null;

      if (convertedValue == null || !Number.isFinite(convertedValue)) {
        throw new Error("Invalid converted value.");
      }

      setRate(numericRate);
      setConverted(convertedValue);

      const date =
        data?.date ?? data?.timestamp ?? data?.info?.timestamp ?? null;
      setLastUpdated(
        date ? String(date).slice(0, 10) : new Date().toISOString().slice(0, 10)
      );

      const respFrom = data?.from ?? data?.From ?? data?.query?.from ?? from;
      const respTo = data?.to ?? data?.To ?? data?.query?.to ?? to;
      setFrom(String(respFrom));
      setTo(String(respTo));
    } catch (err: any) {
      setError(err?.message ?? "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl shadow-lg overflow-hidden m-4 md:m-8"
      style={{
        border: "1px solid var(--panel-border)",
        background: "var(--panel)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      {/* blue-ish border (outer) */}
      <div
        className="p-6 md:p-8"
        style={{
          borderLeft: "4px solid var(--accent)",
          transition: "border-color .15s",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8 mb-6">
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Currency Rate
            </h2>
            <p
              className="text-sm mt-1 text-slate-600 dark:text-slate-200"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              VitalSwap used for USD ⇄ NGN. External provider used for other
              pairs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-300">
              Quick:
            </div>

            <button
              onClick={() => {
                setFrom("USD");
                setTo("NGN");
                setAmount("1");
              }}
              className="px-3 py-1 rounded-lg bg-ghost dark:bg-ghost-dark border border-ghost-border dark:border-ghost-border-dark text-sm hover:bg-ghost-hover dark:hover:bg-ghost-hover-dark text-slate-700 dark:text-slate-100"
              title="USD → NGN quick"
            >
              USD → NGN
            </button>

            <button
              onClick={() => {
                setFrom("NGN");
                setTo("USD");
                setAmount("1");
              }}
              className="px-3 py-1 rounded-lg bg-ghost dark:bg-ghost-dark border border-ghost-border dark:border-ghost-border-dark text-sm hover:bg-ghost-hover dark:hover:bg-ghost-hover-dark text-slate-700 dark:text-slate-100"
              title="NGN → USD quick"
            >
              NGN → USD
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* From */}
          <div>
            <label
              className="block text-sm font-semibold mb-2 text-slate-800 dark:text-slate-100"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              From
            </label>
            <div className="relative">
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-input dark:bg-input-dark border border-input-border dark:border-input-border-dark rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow duration-200 shadow-sm appearance-none text-slate-800 dark:text-slate-500"
                aria-label="Currency"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="NGN">NGN - Nigerian Naira</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
              <FiChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300 pointer-events-none" />
            </div>
          </div>

          {/* Amount + Swap */}
          <div>
            <label
              className="block text-sm font-semibold mb-2 text-slate-800 dark:text-slate-100"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                onKeyDown={onKeyDownNumber}
                className="w-full bg-input dark:bg-input-dark border border-input-border dark:border-input-border-dark rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow duration-150 text-slate-800 dark:text-slate-500"
                aria-label="Amount"
                min="0"
                step="0.01"
              />

              <button
                onClick={swap}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-panel dark:bg-panel-dark px-2 py-1 rounded-md border border-input-border dark:border-input-border-dark shadow-sm hover:bg-panel-hover dark:hover:bg-panel-hover-dark flex items-center justify-center"
                aria-label="Swap currencies"
                title="Swap currencies"
              >
                <FiRepeat className="w-4 h-4 text-slate-700 dark:text-slate-100" />
              </button>
            </div>
          </div>

          {/* To */}
          <div>
            <label
              className="block text-sm font-semibold mb-2 text-slate-800 dark:text-slate-100"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              To
            </label>
            <div className="relative">
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-input dark:bg-input-dark border border-input-border dark:border-input-border-dark rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow duration-200 shadow-sm appearance-none text-slate-800 dark:text-slate-500"
                aria-label="Currency"
              >
                <option value="NGN">NGN - Nigerian Naira</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
              <FiChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* action */}
        <div className="flex flex-col items-center md:flex-row md:items-center gap-4">
          <button
            onClick={calculate}
            disabled={!valid || loading}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-transform duration-150 shadow ${
              valid
                ? "bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            aria-disabled={!valid || loading}
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <FiLoader className="animate-spin" />
                Fetching rate...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <FiArrowRight />
                Get Rate
              </span>
            )}
          </button>

          {/* inline result */}
          <div className="w-full md:w-auto">
            {error ? (
              <div
                className="mt-3 text-sm text-red-600"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {error}
              </div>
            ) : rate == null || converted == null ? (
              <div
                className="mt-3 text-sm text-slate-600 dark:text-slate-300"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Select currencies and click Get Rate.
              </div>
            ) : (
              <div className="mt-3 md:mt-0 bg-panel/80 dark:bg-slate-800/60 border border-panel-border dark:border-panel-border-dark rounded-xl px-4 py-3">
                <div className="flex items-center justify-between gap-4 md:gap-8">
                  <div className="flex items-center gap-3">
                    <Chip code={from} />
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      →
                    </div>
                    <Chip code={to} />
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      1 {from} ={" "}
                      {rate.toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}{" "}
                      {to}
                    </div>
                    <div
                      className="text-lg font-semibold text-slate-900 dark:text-slate-100"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {formatCurrency(converted, to)}
                    </div>
                    {/* {lastUpdated && (
                      <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                        fetched: {lastUpdated}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* refresh button aligns with main action; same color as main button */}
          <button
            onClick={() => {
              /* quick refresh uses existing selection */
              calculate();
            }}
            className="ml-0 md:ml-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-accent"
            title="Refresh / Re-fetch"
            aria-label="Refresh"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            <FiRefreshCw />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
