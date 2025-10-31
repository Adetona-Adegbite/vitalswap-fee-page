// src/components/FeeCards.tsx
import React, { useState, useEffect } from "react";

interface FeeCardsProps {
  userType: "individual" | "business";
}

/**
 * Utility: map gradient hint -> border classes (explicit so Tailwind picks them up)
 */
const BORDER_CLASS_MAP: Record<string, string> = {
  blue: "border-blue-200 dark:border-blue-400/20",
  yellow: "border-yellow-200 dark:border-yellow-400/20",
  default: "border-gray-100 dark:border-gray-700",
};

const pickBorderClassFromGradient = (grad?: string) => {
  if (!grad) return BORDER_CLASS_MAP.default;
  if (grad.includes("yellow")) return BORDER_CLASS_MAP.yellow;
  if (grad.includes("blue")) return BORDER_CLASS_MAP.blue;
  return BORDER_CLASS_MAP.default;
};

const FeeCards: React.FC<FeeCardsProps> = ({ userType }) => {
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [feesData, setFeesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleCard = (cardId: string) => {
    setOpenCardId((prev) => (prev === cardId ? null : cardId));
  };

  useEffect(() => {
    let mounted = true;
    fetch("https://2kbbumlxz3.execute-api.us-east-1.amazonaws.com/default/fee")
      .then((response) => response.json())
      .then((data) => {
        if (!mounted) return;
        setFeesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching fees:", err);
        if (!mounted) return;
        setError("Failed to load fees. Please try again later.");
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const typeKey = userType === "individual" ? "Customer" : "Business";

  // Helper: safe retrieval (if feesData not loaded return empty arrays)
  const safeSection = (sectionName: string) =>
    (feesData && feesData[typeKey] && feesData[typeKey][sectionName]) || [];

  const getVirtualAccountsFees = (isIndividual: boolean) => {
    const usSection = safeSection("US Virtual Bank Account");
    const ngSection = safeSection("NG Virtual Bank Account");
    const usIssue = usSection.find((s: any) =>
      s?.Service?.includes("Account Issue")
    ) || { Fee: "FREE" };
    const ach = usSection.find((s: any) => s.Service === "ACH Deposit Fee") || {
      Fee: "FREE",
    };
    const wire = usSection.find(
      (s: any) => s.Service === "Wire Deposit Fee"
    ) || { Fee: "FREE" };
    const fraudUs = usSection.find(
      (s: any) => s.Service === "Fraud Reversal"
    ) || { Fee: "FREE" };
    const diligence = usSection.find(
      (s: any) => s.Service === "3rd Party Requiring Extra Diligence"
    ) || { Fee: "3%" };
    const funding = ngSection.find(
      (s: any) => s.Service === "NGN Wallet Funding"
    ) || { Fee: "₦0" };
    const fraudNg = ngSection.find(
      (s: any) => s.Service === "Fraud Reversal"
    ) || { Fee: "₦0" };

    return [
      {
        name: `${isIndividual ? "Individual" : "Business"} Account Issue (US)`,
        amount: usIssue.Fee,
      },
      {
        name: `${isIndividual ? "Individual" : "Business"} Account Issue (NG)`,
        amount: "FREE",
      },
      { name: "ACH Deposit", amount: ach.Fee },
      { name: "Wire Deposit", amount: wire.Fee },
      { name: "NGN Wallet Funding", amount: funding.Fee },
      { name: "Fraud Reversal (US)", amount: fraudUs.Fee },
      { name: "Fraud Reversal (NG)", amount: fraudNg.Fee },
      { name: "Extra Diligence (3rd Party)", amount: diligence.Fee },
    ];
  };

  const getTransfersFees = (isIndividual: boolean) => {
    const payoutSection = safeSection(
      isIndividual ? "Payout" : "Business Payout"
    );
    const walletSection = safeSection("Wallet to Wallet Transfer");
    const ngnPayout = payoutSection.find(
      (s: any) => s.Service === "NGN Payout - Instant"
    ) || { Fee: "FREE" };
    const usdPayoutSlow = payoutSection.find(
      (s: any) => s.Service === "USD Payout - 2-5 days"
    ) || { Fee: "FREE" };
    const usdPayoutFast = payoutSection.find(
      (s: any) => s.Service === "USD Payout - 24hours"
    ) || { Fee: "$0" };

    if (isIndividual) {
      const indToInd = walletSection.find(
        (s: any) => s.Service === "NGN Individual → Individual"
      ) || { Fee: "FREE" };
      const indToBus = walletSection.find(
        (s: any) => s.Service === "NGN Individual → Business"
      ) || { Fee: "3%" };
      return [
        { name: "NGN Payout (Instant)", amount: ngnPayout.Fee },
        { name: "USD Payout (2–5 days)", amount: usdPayoutSlow.Fee },
        { name: "USD Payout (24 hours)", amount: usdPayoutFast.Fee },
        { name: "Individual → Individual (NGN)", amount: indToInd.Fee },
        { name: "Individual → Business (NGN)", amount: indToBus.Fee },
      ];
    } else {
      const indToBus = walletSection.find(
        (s: any) => s.Service === "NGN Individual → Business"
      ) || { Fee: "2%" };
      return [
        { name: "NGN Payout (Instant)", amount: ngnPayout.Fee },
        { name: "USD Payout (2–5 days)", amount: usdPayoutSlow.Fee },
        { name: "USD Payout (24 hours)", amount: usdPayoutFast.Fee },
        { name: "Individual → Business (NGN)", amount: indToBus.Fee },
        { name: "Bulk Payout Processing", amount: "$5 per batch" },
      ];
    }
  };

  const getVirtualCardFees = () => {
    const section = safeSection("Freedom Virtual Card");
    return section.map((s: any) => ({
      name: s.Service,
      amount: s.Fee + (s.Description ? ` (${s.Description})` : ""),
    }));
  };

  const getFXFees = () => {
    const section = safeSection("FX");
    return section.map((s: any) => ({
      name: s.Service,
      amount:
        s.Fee +
        (s.Description
          ? ` (${s.Description.replace("We always put ", "").replace(
              " on all offers in the market",
              " spread"
            )})`
          : ""),
    }));
  };

  const getCollectionsFees = () => {
    const section = safeSection("Business Collections");
    const mapped = section.map((s: any) => ({
      name: s.Service,
      amount: s.Fee + (s.Description ? ` (${s.Description})` : ""),
    }));
    return [
      ...mapped,
      { name: "Payment Gateway Integration", amount: "FREE" },
      { name: "Chargeback Handling", amount: "$25" },
    ];
  };

  const cardConfigs =
    userType === "individual"
      ? [
          {
            id: "virtual-accounts",
            title: "Virtual Bank Accounts",
            summary: "US & NG virtual accounts for seamless global banking.",
            feeRange: "FREE – $100",
            icon: "ri-bank-line",
            gradient: "from-blue-500 to-blue-600",
            getFees: () => getVirtualAccountsFees(true),
          },
          {
            id: "transfers-payouts",
            title: "Transfers & Payouts",
            summary: "Send money globally and transfer between wallets.",
            feeRange: "FREE – $10",
            icon: "ri-send-plane-line",
            gradient: "from-yellow-400 to-yellow-500",
            getFees: () => getTransfersFees(true),
          },
          {
            id: "virtual-card",
            title: "Freedom Virtual Card",
            summary: "Spend globally with a secure virtual card.",
            feeRange: "FREE – 1.5%",
            icon: "ri-bank-card-line",
            gradient: "from-blue-400 to-blue-500",
            getFees: () => getVirtualCardFees(),
          },
          {
            id: "fx-exchange",
            title: "Currency Exchange",
            summary: "Swap currencies instantly with competitive rates.",
            feeRange: "FREE",
            icon: "ri-currency-line",
            gradient: "from-yellow-500 to-yellow-600",
            getFees: () => getFXFees(),
          },
        ]
      : [
          {
            id: "business-accounts",
            title: "Business Bank Accounts",
            summary: "Professional US & NG accounts for business operations.",
            feeRange: "FREE – $100",
            icon: "ri-building-line",
            gradient: "from-blue-500 to-blue-600",
            getFees: () => getVirtualAccountsFees(false),
          },
          {
            id: "business-collections",
            title: "Payment Collections",
            summary: "Streamlined payment collection and settlement services.",
            feeRange: "₦200 – 2%",
            icon: "ri-money-dollar-circle-line",
            gradient: "from-yellow-400 to-yellow-500",
            getFees: () => getCollectionsFees(),
          },
          {
            id: "business-payouts",
            title: "Business Payouts & Transfers",
            summary: "Efficient global payments and business transfers.",
            feeRange: "FREE – $10",
            icon: "ri-exchange-funds-line",
            gradient: "from-blue-400 to-blue-500",
            getFees: () => getTransfersFees(false),
          },
          {
            id: "business-fx",
            title: "Business FX Services",
            summary: "Professional currency exchange with better spreads.",
            feeRange: "FREE",
            icon: "ri-line-chart-line",
            gradient: "from-yellow-500 to-yellow-600",
            getFees: () => getFXFees(),
          },
        ];

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 p-6 md:p-12">
        <div className="flex justify-center items-center h-64 col-span-2 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="grid dark:bg-gray-800 grid-cols-1 md:grid-cols-2 gap-8 mb-12 p-6 md:p-12">
      {cardConfigs.map((cardConfig) => {
        const isOpen = openCardId === cardConfig.id;
        const detailsId = `${cardConfig.id}-details`;
        const headerId = `${cardConfig.id}-header`;
        const fees = loading ? [] : cardConfig.getFees();
        const borderClass = pickBorderClassFromGradient(cardConfig.gradient);

        return (
          <div
            key={cardConfig.id}
            data-card-id={cardConfig.id}
            className={`bg-panel  rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border ${borderClass}`}
            aria-labelledby={headerId}
            role="region"
          >
            <div
              className={`bg-gradient-to-r ${cardConfig.gradient} p-6 text-white`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-xl">
                  <i className={`${cardConfig.icon} text-2xl`} aria-hidden />
                </div>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  {cardConfig.feeRange}
                </span>
              </div>

              <h3
                id={headerId}
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {cardConfig.title}
              </h3>

              <p
                className="text-white/90 text-sm"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {cardConfig.summary}
              </p>
            </div>

            <div className="p-6">
              <button
                onClick={() => toggleCard(cardConfig.id)}
                aria-expanded={isOpen}
                aria-controls={detailsId}
                className="w-full bg-panel dark:bg-slate-700 text-accent dark:text-accent py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer border border-transparent hover:scale-[1.01]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                <span className="text-sm">See Details</span>
                <span
                  aria-hidden
                  className={`inline-block transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <i className={`ri-arrow-down-s-line`} />
                </span>
              </button>

              <div
                id={detailsId}
                role="region"
                aria-labelledby={headerId}
                className={`mt-4 space-y-3 ${isOpen ? "block" : "hidden"}`}
              >
                {loading ? (
                  <div className="flex justify-center items-center py-4">
                    <i className="ri-loader-4-line text-3xl animate-spin text-blue-500" />
                  </div>
                ) : (
                  fees.map((fee: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-card-border last:border-b-0"
                    >
                      <span
                        className="text-muted text-sm"
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        {fee.name}
                      </span>
                      <span
                        className="font-semibold text-primary"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {fee.amount}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeeCards;
