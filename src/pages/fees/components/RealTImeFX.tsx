import React, { useEffect, useState } from "react";
import { FiRefreshCw, FiClock, FiDollarSign } from "react-icons/fi";

type RateSample = { ts: number; rate: number };

const API_KEY = import.meta.env.VITE_FX_API_KEY;
const DAYS_BACK = 30; // Fetch last 30 days of historical data
const SOURCE_CURRENCY = "USD";
const TARGET_CURRENCY = "NGN";
const POLL_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

const Sparkline: React.FC<{ samples: RateSample[] }> = ({ samples }) => {
  if (!samples || samples.length < 2)
    return <div className="text-xs text-muted">—</div>;

  const vals = samples.map((s) => s.rate);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.08 || 1;
  const w = 160;
  const h = 44;

  const points = samples
    .map((s, i) => {
      const x = (i / (samples.length - 1)) * w;
      const y = h - ((s.rate - (min - pad)) / (max - min + pad * 2)) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
};

export default function VitalFxUsdNgn() {
  const [rate, setRate] = useState<number | null>(null);
  const [prevRate, setPrevRate] = useState<number | null>(null);
  const [samples, setSamples] = useState<RateSample[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError(null);
    try {
      const endDate = new Date().toISOString().slice(0, 10);
      const startDate = new Date(Date.now() - DAYS_BACK * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      const url = `https://api.exchangerate.host/timeframe?access_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}&currencies=${TARGET_CURRENCY}&source=${SOURCE_CURRENCY}`;
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const json = await res.json();

      if (!json.success || !json.quotes)
        throw new Error("Invalid response format");

      const dates = Object.keys(json.quotes).sort();
      const newSamples: RateSample[] = dates.map((d) => ({
        ts: Date.parse(d),
        rate: json.quotes[d][`${SOURCE_CURRENCY}${TARGET_CURRENCY}`],
      }));

      if (newSamples.length === 0) throw new Error("No data available");

      setSamples(newSamples);
      const latestRate = newSamples[newSamples.length - 1].rate;
      const firstRate = newSamples[0].rate;
      setRate(latestRate);
      setPrevRate(firstRate);
      setLastUpdated(endDate);
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveRate = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.exchangerate.host/live?access_key=${API_KEY}&currencies=${TARGET_CURRENCY}&source=${SOURCE_CURRENCY}`;
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const json = await res.json();

      if (!json.success || !json.quotes)
        throw new Error("Invalid response format");

      const liveRate = json.quotes[`${SOURCE_CURRENCY}${TARGET_CURRENCY}`];
      if (!Number.isFinite(liveRate)) throw new Error("Invalid rate");

      setSamples((prev) => {
        const now = Date.now();
        const cutoff = now - DAYS_BACK * 24 * 60 * 60 * 1000;
        const filtered = prev.filter((s) => s.ts >= cutoff);
        return [...filtered, { ts: now, rate: liveRate }];
      });
      setPrevRate(rate);
      setRate(liveRate);
      setLastUpdated(new Date().toISOString());
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData().then(() => fetchLiveRate());

    const interval = setInterval(fetchLiveRate, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const changePct =
    rate != null && prevRate != null
      ? Math.round(((rate - prevRate) / prevRate) * 10000) / 100
      : null;
  const up = changePct != null && changePct > 0;
  const down = changePct != null && changePct < 0;

  // fonts via CSS variables
  const headingFont = "var(--font-heading)";
  const uiFont = "var(--font-ui)";

  return (
    <div className="max-w-xl mx-auto ">
      <div
        className="rounded-2xl shadow-lg overflow-hidden border bg-panel dark:bg-slate-900"
        style={{
          borderRight: "1px solid var(--accent)",
          borderTop: "1px solid var(--accent)",
          borderBottom: "1px solid var(--accent)",
          borderLeft: "6px solid var(--accent) ",
          transition: "border-color .2s",
        }}
        role="region"
        aria-label="USD to NGN rate"
      >
        <div className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {/* ICON CARD */}
            <div
              className="w-16 h-16 rounded-xl grid place-items-center shrink-0 
             border transition-all duration-300 shadow-sm
             hover:shadow-md hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, var(--icon-grad-from), var(--icon-grad-to))",
                // borderColor: "var(--icon-border)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // width: "20%",
              }}
              aria-hidden
            >
              <p
                //@ts-ignore
                style={{ minSize: "2rem" }}
                className=" text-black-900 dark:text-slate-100 transition-colors"
              >
                $
              </p>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted dark:text-gray-300">
                Current vital swap rate
              </div>

              <div className="flex items-baseline gap-3">
                <div
                  className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white"
                  style={{ fontFamily: headingFont }}
                >
                  {loading ? "…" : rate != null ? rate.toLocaleString() : "—"}
                </div>

                {changePct != null && (
                  <div
                    className={`text-sm font-semibold ${
                      up
                        ? "text-green-500"
                        : down
                        ? "text-red-500"
                        : "text-muted dark:text-gray-300"
                    }`}
                  >
                    {changePct > 0 ? `+${changePct}%` : `${changePct}%`}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted dark:text-gray-300 mt-1">
                1 USD = NGN
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="bg-panel/80 dark:bg-slate-800/60 rounded-lg px-3 py-2 border border-card-border shadow-sm min-w-[120px]">
                  <div className="text-xs text-muted dark:text-gray-300">
                    Converted
                  </div>
                  <div
                    className="text-sm font-semibold dark:text-slate-100"
                    style={{ fontFamily: uiFont }}
                  >
                    {rate != null ? `₦${(1 * rate).toLocaleString()}` : "—"}
                  </div>
                </div>

                <div className="bg-panel/80 dark:bg-slate-800/60 rounded-lg px-3 py-2 border border-card-border shadow-sm min-w-[160px]">
                  <div className="text-xs text-muted dark:text-gray-300">
                    Last updated
                  </div>
                  <div
                    className="text-sm dark:text-slate-100"
                    style={{ fontFamily: uiFont }}
                  >
                    {lastUpdated ? new Date(lastUpdated).toLocaleString() : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex items-center md:flex-col gap-3 justify-end">
            <button
              onClick={fetchLiveRate}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-card-border shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              aria-label="Refresh rate"
            >
              <FiRefreshCw />
              <span className="text-sm text-slate-700 dark:text-gray-200">
                Refresh
              </span>
            </button>

            <div className="text-xs text-muted dark:text-gray-300 flex items-center gap-1">
              <FiClock />
              <span>{loading ? "Loading..." : "Live"}</span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-5 border-t border-card-border bg-panel/60 dark:bg-slate-800/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-muted dark:text-gray-300">
              <div className="text-xs">{DAYS_BACK}-day trend</div>
              <div
                className={`${
                  up
                    ? "text-green-500"
                    : down
                    ? "text-red-500"
                    : "text-muted dark:text-gray-300"
                }`}
                aria-hidden
              >
                <div style={{ minWidth: 180 }}>
                  <Sparkline samples={samples} />
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted dark:text-gray-300">Quote</div>
              <div
                className="text-sm font-semibold dark:text-slate-100"
                style={{ fontFamily: uiFont }}
              >
                {rate != null ? `1 USD = ${rate.toLocaleString()} NGN` : "—"}
              </div>
            </div>
          </div>

          {/* {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )} */}
        </div>

        <div className="sr-only" aria-live="polite">
          {rate != null ? `USD to NGN updated: 1 USD = ${rate} NGN` : ""}
        </div>
      </div>
    </div>
  );
}
