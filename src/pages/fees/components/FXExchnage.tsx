import React, { useState } from "react";
import {
  FiRepeat,
  FiArrowRight,
  FiLoader,
  FiChevronDown,
} from "react-icons/fi";

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

const chip = (code: string) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 shadow-sm">
    <div className="w-6 h-6 rounded-full bg-white grid place-items-center text-xs font-semibold text-gray-700">
      {code.slice(0, 2)}
    </div>
    <div className="text-sm font-medium text-gray-700">{code}</div>
  </div>
);

const ExchangeCalculator: React.FC = () => {
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
    setFrom((prevFrom) => {
      const prevTo = to;
      setTo(prevFrom);
      return prevTo;
    });
    // keep amount as-is
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
      // endpoint returns: { from: "USD", to: "NGN", rate: 1480 }
      const url = `https://2kbbumlxz3.execute-api.us-east-1.amazonaws.com/default/exchange?from=${encodeURIComponent(
        from
      )}&to=${encodeURIComponent(to)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Exchange API responded ${res.status}`);

      const data = await res.json();

      // support both numeric rate and string numbers
      const fetchedRate = data?.rate ?? data?.Rate ?? null;
      if (fetchedRate == null) {
        throw new Error(
          "Unexpected response from exchange API (missing rate)."
        );
      }

      const numericRate =
        typeof fetchedRate === "number"
          ? fetchedRate
          : parseFloat(String(fetchedRate));
      if (!Number.isFinite(numericRate)) {
        throw new Error("Invalid rate returned from exchange API.");
      }

      const convertedValue =
        Math.round((amt * numericRate + Number.EPSILON) * 100) / 100;

      setRate(numericRate);
      setConverted(convertedValue);

      // try to read provided from/to and optional timestamp
      const respFrom = data?.from ?? data?.From ?? from;
      const respTo = data?.to ?? data?.To ?? to;
      // optional: if API returns a timestamp/date, use it; else use now
      const date = data?.date ?? data?.timestamp ?? null;
      setLastUpdated(
        date ? String(date).slice(0, 10) : new Date().toISOString().slice(0, 10)
      );

      // if API returned different currencies, sync them (keeps displayed chips consistent)
      if (respFrom && respTo) {
        setFrom(String(respFrom));
        setTo(String(respTo));
      }
    } catch (err: any) {
      setError(err?.message ?? "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-100 m-4 md:m-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8 mb-6">
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Gilroy, sans-serif" }}
          >
            Currency Rate
          </h2>
          <p
            className="text-sm text-gray-600"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Fetches a single exchange rate (API returns a rate only). Multiply
            by amount to get converted value.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">Quick:</div>
          <button
            onClick={() => {
              setFrom("USD");
              setTo("NGN");
              setAmount("1");
            }}
            className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-100 text-sm hover:bg-gray-100"
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
            className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-100 text-sm hover:bg-gray-100"
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
            className="block text-sm font-semibold text-gray-700 mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            From
          </label>
          <div className="relative">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 shadow-sm appearance-none"
              style={{ fontFamily: "Poppins, sans-serif" }}
              aria-label="Currency"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
            <FiChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Amount + Swap */}
        <div>
          <label
            className="block text-sm font-semibold text-gray-700 mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
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
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow duration-150"
              aria-label="Amount"
              min="0"
              step="0.01"
            />

            <button
              onClick={swap}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm hover:bg-gray-50 flex items-center justify-center"
              aria-label="Swap currencies"
              title="Swap currencies"
            >
              <FiRepeat className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* To */}
        <div>
          <label
            className="block text-sm font-semibold text-gray-700 mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            To
          </label>
          <div className="relative">
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 shadow-sm appearance-none"
              style={{ fontFamily: "Poppins, sans-serif" }}
              aria-label="Currency"
            >
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
            <FiChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          aria-disabled={!valid || loading}
          style={{ fontFamily: "Poppins, sans-serif" }}
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
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {error}
            </div>
          ) : rate == null || converted == null ? (
            <div
              className="mt-3 text-sm text-gray-600"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Select currencies and click Get Rate.
            </div>
          ) : (
            <div className="mt-3 md:mt-0 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between gap-4 md:gap-8">
                <div className="flex items-center gap-3">
                  <div>{chip(from)}</div>
                  <div className="text-sm text-gray-500">→</div>
                  <div>{chip(to)}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    1 {from} ={" "}
                    {rate.toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                    })}{" "}
                    {to}
                  </div>
                  <div
                    className="text-lg font-semibold text-gray-900"
                    style={{ fontFamily: "Gilroy, sans-serif" }}
                  >
                    {formatCurrency(converted, to)}
                  </div>
                  {lastUpdated && (
                    <div className="text-xs text-gray-400 mt-1">
                      fetched: {lastUpdated}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeCalculator;
