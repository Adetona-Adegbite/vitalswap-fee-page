// VitalFxUsdNgn.tsx
import React, { useEffect, useRef, useState } from "react";
import { FiRefreshCw, FiClock, FiChevronDown } from "react-icons/fi";

type RateSample = { ts: number; rate: number };
type PairData = {
  pair: string;
  rate: number | null;
  prevRate?: number | null;
  samples: RateSample[];
  lastUpdated?: string | null;
  changePct?: number | null;
  loading: boolean;
  error?: string | null;
};

const POLL_MS = 5000;
const PAIR = "USD/NGN";
const API_FOR_PAIR = (pair: string) => {
  const [from, to] = pair.split("/").map((s) => s.trim().toUpperCase());
  return `https://2kbbumlxz3.execute-api.us-east-1.amazonaws.com/default/exchange?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;
};

const Sparkline: React.FC<{ samples: RateSample[] }> = ({ samples }) => {
  if (!samples || samples.length < 2)
    return <div className="text-xs text-gray-400">—</div>;
  const vals = samples.map((s) => s.rate);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.08 || 1;
  const w = 120;
  const h = 36;
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
        stroke="#6B7280"
        strokeWidth={1.6}
        points={points}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default function VitalFxUsdNgn() {
  const [item, setItem] = useState<PairData>({
    pair: PAIR,
    rate: null,
    prevRate: null,
    samples: [],
    lastUpdated: null,
    changePct: null,
    loading: true,
    error: undefined,
  });
  const [loadingAll, setLoadingAll] = useState(true);
  const pollRef = useRef<number | null>(null);

  const pushSample = (newRate: number, ts?: number) => {
    setItem((cur) => {
      const prev = cur.rate ?? null;
      const samples = [
        ...cur.samples.filter((s) => Date.now() - s.ts < 60_000),
      ];
      samples.push({ ts: ts ?? Date.now(), rate: newRate });
      if (samples.length > 18) samples.shift();
      const changePct = prev
        ? Math.round(((newRate - prev) / prev) * 10000) / 100
        : cur.changePct ?? null;
      return {
        ...cur,
        rate: newRate,
        prevRate: prev,
        samples,
        lastUpdated: new Date().toISOString(),
        loading: false,
        error: undefined,
        changePct,
      };
    });
  };

  const fetchPair = async () => {
    setItem((s) => ({ ...s, loading: true, error: undefined }));
    try {
      const url = API_FOR_PAIR(PAIR);
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const json = await res.json();
      const r = json?.rate ?? json?.Rate ?? null;
      const numeric = typeof r === "number" ? r : parseFloat(String(r));
      if (!Number.isFinite(numeric)) throw new Error("invalid rate");
      pushSample(
        numeric,
        json?.timestamp ? Date.parse(String(json.timestamp)) : undefined
      );
      setLoadingAll(false);
    } catch (err: any) {
      setItem((cur) => ({
        ...cur,
        loading: false,
        error: String(err?.message ?? err),
      }));
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const start = async () => {
      if (!mounted) return;
      setLoadingAll(true);
      await fetchPair();
      if (!mounted) return;
      pollRef.current = window.setInterval(() => fetchPair(), POLL_MS);
      setLoadingAll(false);
    };
    start();
    return () => {
      mounted = false;
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  const refresh = async () => {
    setLoadingAll(true);
    await fetchPair();
    setLoadingAll(false);
  };

  const up =
    item.rate != null && item.prevRate != null && item.rate > item.prevRate;
  const down =
    item.rate != null && item.prevRate != null && item.rate < item.prevRate;

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-2xl border border-gray-100 shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white/60 border border-gray-100 grid place-items-center text-sm font-bold text-slate-800">
                USD/NGN
              </div>
              <div>
                <div className="text-xs text-gray-500">Live rate</div>
                <div className="flex items-baseline gap-3">
                  <div
                    className="text-2xl md:text-3xl font-extrabold text-slate-900"
                    style={{ fontFamily: "Gilroy, sans-serif" }}
                  >
                    {item.rate != null
                      ? item.rate.toLocaleString()
                      : item.loading
                      ? "…"
                      : "—"}
                  </div>
                  {item.changePct != null && (
                    <div
                      className={`text-sm font-semibold ${
                        up
                          ? "text-green-600"
                          : down
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {item.changePct > 0
                        ? `+${item.changePct}%`
                        : `${item.changePct}%`}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">1 USD = NGN</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="bg-white rounded-lg px-3 py-2 border border-gray-100 shadow-sm">
                <div className="text-xs text-gray-500">Converted</div>
                <div className="text-sm font-semibold">
                  {item.rate != null
                    ? `₦${(1 * item.rate).toLocaleString()}`
                    : "—"}
                </div>
              </div>

              <div className="bg-white rounded-lg px-3 py-2 border border-gray-100 shadow-sm">
                <div className="text-xs text-gray-500">Last updated</div>
                <div className="text-sm">
                  {item.lastUpdated
                    ? new Date(item.lastUpdated).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="w-40 flex flex-col items-end gap-3">
            <button
              onClick={refresh}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-100 shadow-sm hover:bg-gray-50"
            >
              <FiRefreshCw /> <span className="text-sm">Refresh</span>
            </button>

            <div className="text-xs text-gray-400 flex items-center gap-1">
              <FiClock />
              <span>{loadingAll ? "Loading..." : "Live"}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 bg-white/60 p-3 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-500">Trend</div>
            <div style={{ minWidth: 140 }}>
              <Sparkline samples={item.samples} />
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">Quote</div>
            <div className="text-sm font-semibold">
              {item.rate != null
                ? `1 USD = ${item.rate.toLocaleString()} NGN`
                : "—"}
            </div>
          </div>
        </div>

        {item.error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
            {item.error}
          </div>
        )}
      </div>
    </div>
  );
}
