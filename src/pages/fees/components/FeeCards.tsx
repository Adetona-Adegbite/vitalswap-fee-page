import React, { useState } from "react";

interface FeeCardsProps {
  userType: "individual" | "business";
}

const FeeCards: React.FC<FeeCardsProps> = ({ userType }) => {
  // single open card id (null = none). prevents accidental multi-open bugs.
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const toggleCard = (cardId: string) => {
    setOpenCardId((prev) => (prev === cardId ? null : cardId));
  };

  const individualCards = [
    {
      id: "virtual-accounts",
      title: "Virtual Bank Accounts",
      summary: "US & NG virtual accounts for seamless global banking.",
      feeRange: "FREE – $100",
      icon: "ri-bank-line",
      gradient: "from-blue-500 to-blue-600",
      fees: [
        { name: "Individual Account Issue (US)", amount: "FREE" },
        { name: "Individual Account Issue (NG)", amount: "FREE" },
        { name: "ACH Deposit", amount: "FREE" },
        { name: "Wire Deposit", amount: "$15" },
        { name: "NGN Wallet Funding", amount: "₦200" },
        { name: "Fraud Reversal (US)", amount: "$100" },
        { name: "Fraud Reversal (NG)", amount: "₦1,000" },
        { name: "Extra Diligence (3rd Party)", amount: "3%" },
      ],
    },
    {
      id: "transfers-payouts",
      title: "Transfers & Payouts",
      summary: "Send money globally and transfer between wallets.",
      feeRange: "FREE – $10",
      icon: "ri-send-plane-line",
      gradient: "from-yellow-400 to-yellow-500",
      fees: [
        { name: "NGN Payout (Instant)", amount: "FREE" },
        { name: "USD Payout (2–5 days)", amount: "FREE" },
        { name: "USD Payout (24 hours)", amount: "$10" },
        { name: "Individual → Individual (NGN)", amount: "FREE" },
        { name: "Individual → Business (NGN)", amount: "3%" },
      ],
    },
    {
      id: "virtual-card",
      title: "Freedom Virtual Card",
      summary: "Spend globally with a secure virtual card.",
      feeRange: "FREE – 1.5%",
      icon: "ri-bank-card-line",
      gradient: "from-blue-400 to-blue-500",
      fees: [
        { name: "Create Card", amount: "$1" },
        { name: "Fund Card", amount: "$0.50" },
        { name: "Transaction Fee", amount: "1.5% ($1–$5)" },
        { name: "FX Fee (outside US)", amount: "1.5%" },
        { name: "Monthly Maintenance", amount: "$1" },
        { name: "Defund Card", amount: "FREE" },
        { name: "Close Card", amount: "FREE" },
      ],
    },
    {
      id: "fx-exchange",
      title: "Currency Exchange",
      summary: "Swap currencies instantly with competitive rates.",
      feeRange: "FREE",
      icon: "ri-currency-line",
      gradient: "from-yellow-500 to-yellow-600",
      fees: [
        { name: "Create NGN Offer", amount: "FREE" },
        { name: "Buy NGN Offer", amount: "FREE (10–15 pts spread)" },
        { name: "Create USD Offer", amount: "FREE" },
        { name: "Buy USD Offer", amount: "FREE (10–15 pts spread)" },
      ],
    },
  ];

  const businessCards = [
    {
      id: "business-accounts",
      title: "Business Bank Accounts",
      summary: "Professional US & NG accounts for business operations.",
      feeRange: "FREE – $100",
      icon: "ri-building-line",
      gradient: "from-blue-500 to-blue-600",
      fees: [
        { name: "Business Account Issue (US)", amount: "FREE" },
        { name: "Business Account Issue (NG)", amount: "FREE" },
        { name: "ACH Deposit", amount: "FREE" },
        { name: "Wire Deposit", amount: "$15" },
        { name: "NGN Wallet Funding", amount: "₦200" },
        { name: "Fraud Reversal (US)", amount: "$100" },
        { name: "Fraud Reversal (NG)", amount: "₦1,000" },
        { name: "Extra Diligence (3rd Party)", amount: "3%" },
      ],
    },
    {
      id: "business-collections",
      title: "Payment Collections",
      summary: "Streamlined payment collection and settlement services.",
      feeRange: "₦200 – 2%",
      icon: "ri-money-dollar-circle-line",
      gradient: "from-yellow-400 to-yellow-500",
      fees: [
        { name: "NGN Settlement", amount: "₦200 per transaction" },
        { name: "USD Settlement", amount: "2% (min $1, max $2)" },
        { name: "Payment Gateway Integration", amount: "FREE" },
        { name: "Chargeback Handling", amount: "$25" },
      ],
    },
    {
      id: "business-payouts",
      title: "Business Payouts & Transfers",
      summary: "Efficient global payments and business transfers.",
      feeRange: "FREE – $10",
      icon: "ri-exchange-funds-line",
      gradient: "from-blue-400 to-blue-500",
      fees: [
        { name: "NGN Payout (Instant)", amount: "FREE" },
        { name: "USD Payout (2–5 days)", amount: "FREE" },
        { name: "USD Payout (24 hours)", amount: "$10" },
        { name: "Individual → Business (NGN)", amount: "2%" },
        { name: "Bulk Payout Processing", amount: "$5 per batch" },
      ],
    },
    {
      id: "business-fx",
      title: "Business FX Services",
      summary: "Professional currency exchange with better spreads.",
      feeRange: "FREE",
      icon: "ri-line-chart-line",
      gradient: "from-yellow-500 to-yellow-600",
      fees: [
        { name: "Create NGN Offer", amount: "FREE" },
        { name: "Buy NGN Offer", amount: "FREE (10 pts spread)" },
        { name: "Create USD Offer", amount: "FREE" },
        { name: "Buy USD Offer", amount: "FREE (10 pts spread)" },
        { name: "Large Volume Discount", amount: "Available" },
      ],
    },
  ];

  const cards = userType === "individual" ? individualCards : businessCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 p-6 md:p-12">
      {cards.map((card) => {
        console.log(card);

        const isOpen = openCardId === card.id;
        const detailsId = `${card.id}-details`;
        const headerId = `${card.id}-header`;

        return (
          <div
            key={card.id}
            data-card-id={card.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
          >
            <div className={`bg-gradient-to-r ${card.gradient} p-6 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-xl">
                  <i className={`${card.icon} text-2xl`} aria-hidden />
                </div>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  {card.feeRange}
                </span>
              </div>

              <h3
                id={headerId}
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "Gilroy, sans-serif" }}
              >
                {card.title}
              </h3>

              <p
                className="text-white/90 text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {card.summary}
              </p>
            </div>

            <div className="p-6">
              <button
                onClick={() => toggleCard(card.id)}
                aria-expanded={isOpen}
                aria-controls={detailsId}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <span>See Details</span>
                {/* arrow element with local transform only */}
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
                {card.fees.map((fee, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {fee.name}
                    </span>
                    <span
                      className="font-semibold text-gray-900"
                      style={{ fontFamily: "Gilroy, sans-serif" }}
                    >
                      {fee.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeeCards;
