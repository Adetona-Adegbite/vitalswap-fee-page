import React, { useEffect, useState } from "react";
import { FiLoader, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

interface FeeCalculatorProps {
  userType: "individual" | "business";
}

type ApiServiceRaw = {
  Service: string;
  Fee: string;
  Description: string;
};

type FeeApiResponse = Record<string, ApiServiceRaw[]> & {
  Customer?: Record<string, ApiServiceRaw[]>;
  Business?: Record<string, ApiServiceRaw[]>;
};

const formatCurrency = (value: number, currency: string) => {
  if (Number.isNaN(value)) return "-";
  if (currency === "NGN") return `₦${value.toLocaleString()}`;
  if (currency === "EUR") return `€${value.toLocaleString()}`;
  if (currency === "GBP") return `£${value.toLocaleString()}`;
  return `$${value.toLocaleString()}`;
};

const onKeyDownNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
};

/**
 * parseFee: parses strings like:
 *  - "FREE"
 *  - "$1"
 *  - "₦200"
 *  - "1.5% ($1 – $5)"
 *  - "2% ($1-$2)"
 *
 * Returns an object with percent, fixed, min, max, currencySymbol, isFree, raw
 */
const parseFee = (feeStr: string, description = "") => {
  if (!feeStr || feeStr.trim().length === 0) {
    return {
      percent: 0,
      fixed: 0,
      min: 0,
      max: 0,
      currency: "",
      isFree: false,
      raw: feeStr,
    };
  }

  const s = feeStr.trim();

  if (s.toUpperCase() === "FREE") {
    return {
      percent: 0,
      fixed: 0,
      min: 0,
      max: 0,
      currency: "",
      isFree: true,
      raw: s,
    };
  }

  let currency = "";
  if (s[0] === "$" || s[0] === "₦" || s[0] === "€" || s[0] === "£")
    currency = s[0];

  // percent pattern
  const percentMatch = s.match(/([\d.]+)%/);
  const hasPercent = !!percentMatch;
  const percent = hasPercent ? parseFloat(percentMatch![1]) : 0;

  // fixed number pattern (first number with currency if present) — only pick non-percent numbers
  const fixedMatch = s.match(/(?:\$|₦|€|£)?\s*([\d,.]+)(?!.*%)/);
  let fixed = 0;
  if (fixedMatch && !hasPercent) {
    fixed = parseFloat(fixedMatch[1].replace(/,/g, ""));
  } else if (fixedMatch && hasPercent) {
    // sometimes there's both percent and a fixed cap inside parentheses — keep fixed as 0 here (caps handled by min/max)
    fixed = 0;
  }

  // min/max inside parentheses e.g. ($1 – $5) or ($1-$5)
  let min = 0;
  let max = 0;
  const rangeMatch = s.match(/\(([^)]+)\)/);
  if (rangeMatch) {
    const inside = rangeMatch[1].replace(/\s/g, "");
    const parts = inside.split(/[-–—]/).map((p) => p.replace(/\$|₦|€|£/g, ""));
    if (parts.length === 2) {
      min = parseFloat(parts[0]) || 0;
      max = parseFloat(parts[1]) || 0;
    }
  }

  return {
    percent,
    fixed,
    min,
    max,
    currency,
    isFree: false,
    raw: s,
    description,
  };
};

const FeeCalculator: React.FC<FeeCalculatorProps> = ({ userType }) => {
  const [transactionType, setTransactionType] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [feesData, setFeesData] = useState<FeeApiResponse | null>(null);
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true); // initial data load
  const [calcLoading, setCalcLoading] = useState(false); // calculation in progress
  const [error, setError] = useState<string | null>(null);

  // result state shown only after Calculate pressed
  const [calculated, setCalculated] = useState<{
    totalFee: number | null;
    lines: { title: string; feeDisplay: string; computed: number | null }[];
    note?: string;
  } | null>(null);

  const valid = transactionType !== "" && currency !== "" && Number(amount) > 0;

  // initial fetch: fee endpoint + exchange rates (USD base)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [feeRes, rateRes] = await Promise.all([
          fetch(
            "https://2kbbumlxz3.execute-api.us-east-1.amazonaws.com/default/fee"
          ),
          fetch("https://api.exchangerate.host/latest?base=USD"),
        ]);
        if (!feeRes.ok) throw new Error(`Fee endpoint ${feeRes.status}`);
        if (!rateRes.ok) throw new Error(`Rate endpoint ${rateRes.status}`);
        const feeJson = await feeRes.json();
        const rateJson = await rateRes.json();
        if (!mounted) return;
        setFeesData(feeJson);
        const ratesMap: Record<string, number> = rateJson.rates ?? {};
        ratesMap["USD"] = 1;
        setRates(ratesMap);
      } catch (err: any) {
        console.error(err);
        if (!mounted) return;
        setError("Failed to load fee or rate data. Try refreshing.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // helper to safely read API data for userType
  const sectionKey = userType === "individual" ? "Customer" : "Business";
  const getSection = () => {
    if (!feesData) return null;
    return (feesData as any)[sectionKey] as
      | Record<string, ApiServiceRaw[]>
      | undefined;
  };

  // helper: find keys in the section that match substrings/variants
  const findSectionKeys = (
    section: Record<string, ApiServiceRaw[]> | undefined,
    patterns: string[]
  ) => {
    if (!section) return [];
    const keys = Object.keys(section);
    const found: string[] = [];
    const lowerKeys = keys.map((k) => k.toLowerCase());
    for (const p of patterns) {
      const lp = p.toLowerCase();
      // exact match
      const exact = keys.find((k) => k.toLowerCase() === lp);
      if (exact && !found.includes(exact)) found.push(exact);
      // includes match
      keys.forEach((k, i) => {
        if (k.toLowerCase().includes(lp) && !found.includes(k)) found.push(k);
      });
      // fuzzy: startsWith
      keys.forEach((k) => {
        if (k.toLowerCase().startsWith(lp) && !found.includes(k)) found.push(k);
      });
    }
    return found;
  };

  // map user selection to service list(s) — made more resilient to key name variants
  const pickServices = (): ApiServiceRaw[] => {
    const section = getSection();
    if (!section) return [];

    const pushFromKeys = (
      arr: ApiServiceRaw[],
      keys: string[],
      predicate?: (s: ApiServiceRaw) => boolean
    ) => {
      keys.forEach((k) => {
        const list = section[k];
        if (!Array.isArray(list)) return;
        if (predicate) arr.push(...list.filter(predicate));
        else arr.push(...list);
      });
    };

    const out: ApiServiceRaw[] = [];

    switch (transactionType) {
      case "deposit": {
        if (currency === "NGN") {
          // prefer NG Virtual Bank Account
          const keys = findSectionKeys(section, [
            "NG Virtual Bank Account",
            "NG Virtual",
            "NG Virtual Account",
          ]);
          pushFromKeys(out, keys, (s) => s.Service === "NGN Wallet Funding");
        } else {
          // USD deposits: US Virtual Bank Account — include ACH and Wire if present
          const keys = findSectionKeys(section, [
            "US Virtual Bank Account",
            "US Virtual",
            "Virtual Bank Account",
          ]);
          pushFromKeys(out, keys, (s) =>
            [
              "ACH Deposit Fee",
              "Wire Deposit Fee",
              "ACH Deposit",
              "Wire Deposit",
            ].includes(s.Service)
          );
        }
        break;
      }
      case "payout": {
        const payoutKeyCandidates =
          userType === "individual"
            ? ["Payout", "Payouts"]
            : ["Business Payout", "Business Payouts", "Business Payout"];
        const keys = findSectionKeys(section, payoutKeyCandidates);
        if (currency === "NGN") {
          pushFromKeys(
            out,
            keys,
            (s) =>
              s.Service.toLowerCase().includes("ngn payout") ||
              s.Service.toLowerCase().includes("ngn payout - instant") ||
              s.Service.toLowerCase().includes("ngn payout -")
          );
        } else {
          pushFromKeys(out, keys, (s) =>
            s.Service.toLowerCase().includes("usd payout")
          );
        }
        break;
      }
      case "transfer": {
        const keys = findSectionKeys(section, [
          "Wallet to Wallet Transfer",
          "Wallet to Wallet",
          "Wallet",
        ]);
        pushFromKeys(out, keys);
        break;
      }
      case "fx": {
        const keys = findSectionKeys(section, [
          "FX",
          "Fx",
          "Currency Exchange",
          "Exchange",
        ]);
        pushFromKeys(out, keys);
        break;
      }
      case "card": {
        // Robust lookup for Freedom Virtual Card and reasonable variants
        const keys = findSectionKeys(section, [
          "Freedom Virtual Card",
          "Virtual Card",
          "Freedom Card",
          "Card",
          "Virtual Cards",
        ]);
        // push the whole section (we will choose transaction fee/others later)
        pushFromKeys(out, keys);
        break;
      }
      default:
        break;
    }

    // dedupe by Service name
    const unique: Record<string, ApiServiceRaw> = {};
    out.forEach((s) => {
      if (s && s.Service) unique[s.Service] = s;
    });
    return Object.values(unique);
  };

  // helper: convert an amount that is in USD to target currency or vice versa
  // rates maps currency -> value where 1 USD = rates[currency]
  const convertUsdTo = (usdValue: number, toCurrency: string) => {
    if (!rates) return NaN;
    const rate = rates[toCurrency];
    if (!rate) return NaN;
    return usdValue * rate;
  };

  // Calculate handler (only runs when user clicks)
  const calculate = async () => {
    setError(null);
    setCalculated(null);
    setCalcLoading(true);

    try {
      const amt = parseFloat(amount);
      if (Number.isNaN(amt) || amt <= 0) {
        setError("Enter a valid amount greater than 0.");
        setCalcLoading(false);
        return;
      }
      if (!feesData || !rates) {
        setError("Fee or rate data not loaded. Try again.");
        setCalcLoading(false);
        return;
      }

      const services = pickServices();
      if (!services || services.length === 0) {
        setCalculated({
          totalFee: null,
          lines: [
            {
              title: "No fee data found for selection",
              feeDisplay: "-",
              computed: null,
            },
          ],
          note: "No matching service lines were found for that transaction type + currency.",
        });
        setCalcLoading(false);
        return;
      }

      const lines: {
        title: string;
        feeDisplay: string;
        computed: number | null;
      }[] = [];
      let lowest = Infinity;
      let anyComputed = false;

      for (const svc of services) {
        const feeText = svc.Fee ?? "";
        const desc = svc.Description ?? "";
        if (!feeText || feeText.trim() === "") {
          lines.push({
            title: svc.Service,
            feeDisplay: "No fee info",
            computed: null,
          });
          continue;
        }

        const parsed = parseFee(feeText, desc);

        if (parsed.isFree) {
          lines.push({ title: svc.Service, feeDisplay: "FREE", computed: 0 });
          lowest = Math.min(lowest, 0);
          anyComputed = true;
          continue;
        }

        // compute fixed (if currency symbol present in fee) or percent on amt
        let fixedInSelected = 0;
        if (parsed.fixed && parsed.currency) {
          const baseCur =
            parsed.currency === "₦"
              ? "NGN"
              : parsed.currency === "$"
              ? "USD"
              : parsed.currency === "€"
              ? "EUR"
              : parsed.currency === "£"
              ? "GBP"
              : "USD";
          let fixedUsd = parsed.fixed;
          if (baseCur !== "USD") {
            const r = rates[baseCur];
            if (!r) {
              lines.push({
                title: svc.Service,
                feeDisplay: `Fee present (${feeText}) — missing rate for ${baseCur}`,
                computed: null,
              });
              continue;
            }
            fixedUsd = parsed.fixed / r;
          }
          const fixedInSelectedVal = convertUsdTo(fixedUsd, currency);
          fixedInSelected = Number.isFinite(fixedInSelectedVal)
            ? fixedInSelectedVal
            : 0;
        }

        // compute percent fee on amt (amt is in selected currency)
        const percentFee =
          parsed.percent > 0 ? (amt * parsed.percent) / 100 : 0;

        // handle min/max if provided (they are absolute values in the fee string)
        let minVal = 0;
        let maxVal = 0;
        if (parsed.min && parsed.min > 0) {
          if (parsed.currency) {
            const baseCur =
              parsed.currency === "₦"
                ? "NGN"
                : parsed.currency === "$"
                ? "USD"
                : parsed.currency === "€"
                ? "EUR"
                : parsed.currency === "£"
                ? "GBP"
                : "USD";
            let minUsd = parsed.min;
            if (baseCur !== "USD") {
              const r = rates[baseCur];
              if (r) minUsd = parsed.min / r;
            }
            const minSelected = convertUsdTo(minUsd, currency);
            minVal = Number.isFinite(minSelected) ? minSelected : 0;
          } else {
            minVal = parsed.min;
          }
        }

        if (parsed.max && parsed.max > 0) {
          if (parsed.currency) {
            const baseCur =
              parsed.currency === "₦"
                ? "NGN"
                : parsed.currency === "$"
                ? "USD"
                : parsed.currency === "€"
                ? "EUR"
                : parsed.currency === "£"
                ? "GBP"
                : "USD";
            let maxUsd = parsed.max;
            if (baseCur !== "USD") {
              const r = rates[baseCur];
              if (r) maxUsd = parsed.max / r;
            }
            const maxSelected = convertUsdTo(maxUsd, currency);
            maxVal = Number.isFinite(maxSelected) ? maxSelected : 0;
          } else {
            maxVal = parsed.max;
          }
        }

        // total before min/max
        let computed = percentFee + fixedInSelected;
        // apply min/max caps if provided
        if (minVal > 0 && computed < minVal) computed = minVal;
        if (maxVal > 0 && computed > maxVal) computed = maxVal;

        // round
        computed = Math.round((computed + Number.EPSILON) * 100) / 100;
        anyComputed = true;
        lowest = Math.min(lowest, computed);

        // build readable display
        const parts: string[] = [];
        if (parsed.percent > 0) parts.push(`${parsed.percent}%`);
        if (parsed.fixed > 0) {
          const originalFixed = parsed.currency
            ? `${parsed.currency}${parsed.fixed}`
            : `${parsed.fixed}`;
          const convertedFixed = fixedInSelected
            ? ` (${formatCurrency(fixedInSelected, currency)})`
            : "";
          parts.push(`${originalFixed}${convertedFixed}`);
        }
        if (minVal > 0 || maxVal > 0) {
          parts.push(
            `(min ${formatCurrency(minVal, currency)}, max ${formatCurrency(
              maxVal,
              currency
            )})`
          );
        }
        if (!parsed.isFree && parts.length === 0) parts.push(parsed.raw);

        const feeDisplay = `${parts.join(" + ")}`.trim();

        lines.push({
          title: svc.Service,
          feeDisplay: feeDisplay || svc.Fee,
          computed,
        });
      }

      const totalFee =
        anyComputed && lowest !== Infinity
          ? Math.round((lowest + Number.EPSILON) * 100) / 100
          : null;

      const note =
        "Displayed fees are estimates converted to your selected currency using live FX rates.";

      setCalculated({
        totalFee,
        lines,
        note,
      });
    } catch (err: any) {
      console.error(err);
      setError("An error occurred while calculating. Try again.");
    } finally {
      setCalcLoading(false);
    }
  };

  // UI loading
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100 m-6 md:m-12 flex justify-center items-center h-56">
        <FiLoader className="text-3xl animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100 m-6 md:m-12">
      <div className="text-center mb-6">
        <h2
          className="text-3xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "Gilroy, sans-serif" }}
        >
          Estimate Your Fees
        </h2>
        <p
          className="text-gray-600"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Choose a transaction and click <strong>Calculate Fees</strong> to see
          estimated costs (converted to selected currency).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Transaction Type */}
        <div>
          <label
            className="block text-sm font-semibold text-gray-700 mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Transaction Type
          </label>
          <div className="relative">
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 shadow-sm appearance-none"
              aria-label="Transaction Type"
            >
              <option value="">Select type</option>
              <option value="payout">Payout</option>
              <option value="deposit">Deposit</option>
              <option value="transfer">Transfer</option>
              <option value="fx">Currency Exchange</option>
              {/* <option value="card">Virtual Card</option> */}
            </select>
            <svg
              className="w-5 h-5 absolute right-3 top-3 text-gray-400 pointer-events-none"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Currency */}
        <div>
          <label
            className="block text-sm font-semibold text-gray-700 mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Currency
          </label>
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 shadow-sm appearance-none"
              aria-label="Currency"
            >
              <option value="">Select currency</option>
              <option value="USD">USD - US Dollar</option>
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
            <svg
              className="w-5 h-5 absolute right-3 top-3 text-gray-400 pointer-events-none"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Amount */}
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
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 shadow-sm appearance-none"
              aria-label="Amount"
              min="0"
              step="0.01"
            />
            <span
              className="absolute left-2 top-3 text-gray-400 pointer-events-none pr-1"
              aria-hidden
            >
              {currency === "NGN"
                ? "₦"
                : currency === "EUR"
                ? "€"
                : currency === "GBP"
                ? "£"
                : "$"}
            </span>
          </div>
        </div>
      </div>

      {/* action */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center mb-6">
        <button
          onClick={calculate}
          disabled={!valid || calcLoading}
          className={`px-8 py-3 rounded-xl font-semibold text-white transition-transform duration-200 shadow-lg ${
            valid && !calcLoading
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          aria-disabled={!valid || calcLoading}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <span className="inline-flex items-center gap-2">
            {calcLoading ? (
              <FiLoader className="animate-spin" />
            ) : (
              <FiCheckCircle />
            )}
            {calcLoading ? "Calculating..." : "Calculate Fees"}
          </span>
        </button>

        <div className="min-w-[240px] bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
          {!calcLoading && !calculated && !error && (
            <div className="text-sm text-gray-600">
              Click <strong>Calculate Fees</strong> to show estimates here.
            </div>
          )}
          {calcLoading && (
            <div className="flex justify-center items-center py-4">
              <FiLoader className="text-3xl animate-spin text-blue-500" />
            </div>
          )}
          {!calcLoading && error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          {!calcLoading && calculated && (
            <div
              className="text-sm text-gray-800"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <div className="text-xs text-gray-500">
                Result (lowest possible)
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {calculated.totalFee === null
                  ? "—"
                  : formatCurrency(calculated.totalFee, currency)}
              </div>
              {calculated.note && (
                <div className="text-xs text-gray-400 mt-1">
                  {calculated.note}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* explanation area - only shown after calculate */}
      {calculated && (
        <div className="mt-6">
          <h3
            className="text-lg font-semibold mb-3"
            style={{ fontFamily: "Gilroy, sans-serif" }}
          >
            Explanation
          </h3>

          <div className="space-y-3">
            {calculated.lines.map((l, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <div
                    className="text-sm font-medium text-gray-700"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {l.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {l.feeDisplay}
                  </div>
                </div>
                <div className="text-right">
                  {l.computed === null ? (
                    <div className="text-sm text-gray-500">—</div>
                  ) : (
                    <div className="text-sm text-gray-900 font-semibold">
                      {formatCurrency(l.computed, currency)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Note: these are estimates. For exact, per-transaction pricing use
            the live API or contact support.
          </div>
        </div>
      )}

      {/* compact help / quick links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
          <strong className="block text-gray-800 mb-1">Data source</strong>
          Vitalswap Fee API
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
          <strong className="block text-gray-800 mb-1">
            If missing amounts
          </strong>
          Services without amounts show “No fee info”. You can refresh the fee
          feed using the refresh button on the main fees page.
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
          <strong className="block text-gray-800 mb-1">Contact</strong>
          need precise quotes? Email{" "}
          <a
            className="text-blue-600 underline"
            href="mailto:contact@vitalswap.com"
          >
            contact@vitalswap.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeeCalculator;
