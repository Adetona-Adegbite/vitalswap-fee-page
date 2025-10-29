import { useState } from "react";

const feeRules: Record<
  string,
  { percent: number; fixed: number; label?: string }
> = {
  payout: { percent: 0.5, fixed: 0, label: "Payout" },
  deposit: { percent: 0.2, fixed: 0, label: "Deposit" },
  transfer: { percent: 0.0, fixed: 0, label: "Transfer" },
  fx: { percent: 1.5, fixed: 0, label: "Currency Exchange" },
  card: { percent: 1.5, fixed: 1, label: "Virtual Card" },
};

const faqs = [
  {
    id: "faq-1",
    q: "How accurate is this estimate?",
    a: "This is a simplified estimate for design/demo. Real fees depend on currency, route, volume discounts and exact product configuration.",
  },
  {
    id: "faq-2",
    q: "What currencies are supported?",
    a: "USD, NGN, EUR and GBP in this demo. Production would pull live rates and supported rails from the backend.",
  },
  {
    id: "faq-3",
    q: "Why is FX higher?",
    a: "FX usually includes a spread and/or percentage fee on top of the base rate — this demo applies a 1.5% sample FX fee.",
  },
];

const formatCurrency = (value: number, currency: string) => {
  if (Number.isNaN(value)) return "-";
  if (currency === "NGN") return `₦${value.toLocaleString()}`;
  if (currency === "EUR") return `€${value.toLocaleString()}`;
  if (currency === "GBP") return `£${value.toLocaleString()}`;
  return `$${value.toLocaleString()}`;
};

const FeeCalculator = () => {
  const [transactionType, setTransactionType] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<null | {
    totalFee: number;
    breakdown: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<Record<string, boolean>>({});

  const valid = transactionType && currency && Number(amount) > 0;

  const calculate = () => {
    setError(null);
    setResult(null);
    const amt = parseFloat(amount);
    if (!valid || Number.isNaN(amt) || amt <= 0) {
      setError("Enter a valid amount, transaction type and currency.");
      return;
    }
    const rule = feeRules[transactionType] ?? { percent: 0, fixed: 0 };
    const percentFee = (amt * rule.percent) / 100;
    const totalFee = Math.max(0, percentFee + rule.fixed);

    const breakdown = `${rule.percent}% of ${formatCurrency(
      amt,
      currency
    )} + ${formatCurrency(rule.fixed, currency)}`;

    setResult({
      totalFee: Math.round((totalFee + Number.EPSILON) * 100) / 100,
      breakdown,
    });
  };

  // small helper to block 'e', '+', '-' in numeric input
  const onKeyDownNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  };

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
          Get a quick estimate of transaction costs.
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
              style={{ fontFamily: "Poppins, sans-serif" }}
              aria-label="Transaction Type"
            >
              <option value="">Select type</option>
              <option value="payout">Payout</option>
              <option value="deposit">Deposit</option>
              <option value="transfer">Transfer</option>
              <option value="fx">Currency Exchange</option>
              <option value="card">Virtual Card</option>
            </select>
            {/* custom arrow */}
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
              style={{ fontFamily: "Poppins, sans-serif" }}
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
              style={{ fontFamily: "Poppins, sans-serif" }}
              aria-label="Amount"
              min="0"
              step="0.01"
            />
            <span
              className="absolute left-3 top-3 text-gray-400 pointer-events-none"
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

      {/* action + result */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center mb-6">
        <button
          onClick={calculate}
          disabled={!valid}
          className={`px-8 py-3 rounded-xl font-semibold text-white transition-transform duration-200 shadow-lg ${
            valid
              ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:scale-105"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          style={{ fontFamily: "Poppins, sans-serif" }}
          aria-disabled={!valid}
        >
          <span className="inline-flex items-center gap-2">
            <i className="ri-calculator-line" />
            Calculate Fees
          </span>
        </button>

        {/* <div className="min-w-[220px] bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
          {error && (
            <div
              className="text-sm text-red-600"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {error}
            </div>
          )}
        </div> */}
      </div>

      {/* FAQ */}
      <div className="mt-6">
        <h3
          className="text-lg font-semibold mb-3"
          style={{ fontFamily: "Gilroy, sans-serif" }}
        >
          Frequently asked
        </h3>
        <div className="space-y-2">
          {faqs.map((f) => {
            const isOpen = !!openFaq[f.id];
            return (
              <div
                key={f.id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenFaq((s) => ({ ...s, [f.id]: !s[f.id] }))
                  }
                  aria-expanded={isOpen}
                  aria-controls={`${f.id}-panel`}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <span className="text-sm font-medium text-gray-800">
                    {f.q}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
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
                </button>

                <div
                  id={`${f.id}-panel`}
                  role="region"
                  aria-labelledby={f.id}
                  className={`px-4 pb-4 transition-all duration-200 ${
                    isOpen ? "block" : "hidden"
                  }`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <div className="text-sm text-gray-600">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeeCalculator;
