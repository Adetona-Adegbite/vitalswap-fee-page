import React, { useState, useEffect } from "react";

interface FeeCardsProps {
  userType: "individual" | "business";
}

const FeeCards: React.FC<FeeCardsProps> = ({ userType }) => {
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [feesData, setFeesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleCard = (cardId: string) => {
    setOpenCardId((prev) => (prev === cardId ? null : cardId));
  };

  useEffect(() => {
    fetch("https://2kbbumlxz3.execute-api.us-east-1.amazonaws.com/default/fee")
      .then((response) => response.json())
      .then((data) => {
        setFeesData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching fees:", error);
        setError("Failed to load fees. Please try again later.");
        setLoading(false);
      });
  }, []);

  const typeKey = userType === "individual" ? "Customer" : "Business";

  const getVirtualAccountsFees = (data: any, isIndividual: boolean) => {
    const usSection = data["US Virtual Bank Account"];
    const ngSection = data["NG Virtual Bank Account"];
    const usIssue = usSection.find((s: any) =>
      s.Service.includes("Account Issue")
    );
    const ach = usSection.find((s: any) => s.Service === "ACH Deposit Fee");
    const wire = usSection.find((s: any) => s.Service === "Wire Deposit Fee");
    const fraudUs = usSection.find((s: any) => s.Service === "Fraud Reversal");
    const diligence = usSection.find(
      (s: any) => s.Service === "3rd Party Requiring Extra Diligence"
    );
    const funding = ngSection.find(
      (s: any) => s.Service === "NGN Wallet Funding"
    );
    const fraudNg = ngSection.find((s: any) => s.Service === "Fraud Reversal");

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

  const getTransfersFees = (data: any, isIndividual: boolean) => {
    const payoutSection = data[isIndividual ? "Payout" : "Business Payout"];
    const walletSection = data["Wallet to Wallet Transfer"];
    const ngnPayout = payoutSection.find(
      (s: any) => s.Service === "NGN Payout - Instant"
    );
    const usdPayoutSlow = payoutSection.find(
      (s: any) => s.Service === "USD Payout - 2-5 days"
    );
    const usdPayoutFast = payoutSection.find(
      (s: any) => s.Service === "USD Payout - 24hours"
    );

    if (isIndividual) {
      const indToInd = walletSection.find(
        (s: any) => s.Service === "NGN Individual → Individual"
      );
      const indToBus = walletSection.find(
        (s: any) => s.Service === "NGN Individual → Business"
      );
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
      );
      return [
        { name: "NGN Payout (Instant)", amount: ngnPayout.Fee },
        { name: "USD Payout (2–5 days)", amount: usdPayoutSlow.Fee },
        { name: "USD Payout (24 hours)", amount: usdPayoutFast.Fee },
        { name: "Individual → Business (NGN)", amount: indToBus.Fee },
        { name: "Bulk Payout Processing", amount: "$5 per batch" },
      ];
    }
  };

  const getVirtualCardFees = (data: any) => {
    const section = data["Freedom Virtual Card"];
    return section.map((s: any) => ({
      name: s.Service,
      amount: s.Fee + (s.Description ? ` (${s.Description})` : ""),
    }));
  };

  const getFXFees = (data: any) => {
    const section = data.FX;
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

  const getCollectionsFees = (data: any) => {
    const section = data["Business Collections"];
    return [
      ...section.map((s: any) => ({
        name: s.Service,
        amount: s.Fee + (s.Description ? ` (${s.Description})` : ""),
      })),
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
            getFees: () => getVirtualAccountsFees(feesData[typeKey], true),
          },
          {
            id: "transfers-payouts",
            title: "Transfers & Payouts",
            summary: "Send money globally and transfer between wallets.",
            feeRange: "FREE – $10",
            icon: "ri-send-plane-line",
            gradient: "from-yellow-500 to-yellow-500",
            getFees: () => getTransfersFees(feesData[typeKey], true),
          },
          {
            id: "virtual-card",
            title: "Freedom Virtual Card",
            summary: "Spend globally with a secure virtual card.",
            feeRange: "FREE – 1.5%",
            icon: "ri-bank-card-line",
            gradient: "from-blue-500 to-blue-600",
            getFees: () => getVirtualCardFees(feesData[typeKey]),
          },
          {
            id: "fx-exchange",
            title: "Currency Exchange",
            summary: "Swap currencies instantly with competitive rates.",
            feeRange: "FREE",
            icon: "ri-currency-line",
            gradient: "from-yellow-500 to-yellow-500",
            getFees: () => getFXFees(feesData[typeKey]),
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
            getFees: () => getVirtualAccountsFees(feesData[typeKey], false),
          },
          {
            id: "business-collections",
            title: "Payment Collections",
            summary: "Streamlined payment collection and settlement services.",
            feeRange: "₦200 – 2%",
            icon: "ri-money-dollar-circle-line",
            gradient: "from-yellow-500 to-yellow-500",
            getFees: () => getCollectionsFees(feesData[typeKey]),
          },
          {
            id: "business-payouts",
            title: "Business Payouts & Transfers",
            summary: "Efficient global payments and business transfers.",
            feeRange: "FREE – $10",
            icon: "ri-exchange-funds-line",
            gradient: "from-blue-500 to-blue-600",
            getFees: () => getTransfersFees(feesData[typeKey], false),
          },
          {
            id: "business-fx",
            title: "Business FX Services",
            summary: "Professional currency exchange with better spreads.",
            feeRange: "FREE",
            icon: "ri-line-chart-line",
            gradient: "from-yellow-500 to-yellow-500",
            getFees: () => getFXFees(feesData[typeKey]),
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 p-6 md:p-12">
      {cardConfigs.map((cardConfig) => {
        const isOpen = openCardId === cardConfig.id;
        const detailsId = `${cardConfig.id}-details`;
        const headerId = `${cardConfig.id}-header`;
        const fees = loading ? [] : cardConfig.getFees();

        return (
          <div
            key={cardConfig.id}
            data-card-id={cardConfig.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
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
                style={{ fontFamily: "Gilroy, sans-serif" }}
              >
                {cardConfig.title}
              </h3>

              <p
                className="text-white/90 text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {cardConfig.summary}
              </p>
            </div>

            <div className="p-6">
              <button
                onClick={() => toggleCard(cardConfig.id)}
                aria-expanded={isOpen}
                aria-controls={detailsId}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <span>See Details</span>
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
                    <i className="ri-loader-4-line text-3xl animate-spin text-blue-500"></i>
                  </div>
                ) : (
                  fees.map((fee: any, index: number) => (
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
