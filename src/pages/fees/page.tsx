import { useState } from "react";
import Header from "./components/Header";
import FeeCards from "./components/FeeCards";
import FeeCalculator from "./components/FeeCalculator";
import WhereFeesGo from "./components/WhereFeesGo";
import Footer from "./components/Footer";
import ExchangeCalculator from "./components/FXExchnage";
import VitalFxTicker from "./components/RealTImeFX";
import PageCopilot from "./components/PageCopilot";
import OnboardingModal from "./components/OnboardingModal";

export default function FeesPage() {
  const [userType, setUserType] = useState<"individual" | "business">(
    "individual"
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <Header userType={userType} onUserTypeChange={setUserType} />
      <FeeCards userType={userType} />
      <VitalFxTicker />
      <FeeCalculator userType={userType} />
      <ExchangeCalculator />
      <PageCopilot />
      <OnboardingModal />
      <WhereFeesGo />
      <Footer />
    </div>
  );
}
