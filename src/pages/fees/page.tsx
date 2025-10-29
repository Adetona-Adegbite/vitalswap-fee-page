import { useState } from "react";
import Header from "./components/Header";
import FeeCards from "./components/FeeCards";
import FeeCalculator from "./components/FeeCalculator";
import WhereFeesGo from "./components/WhereFeesGo";
import Footer from "./components/Footer";

export default function FeesPage() {
  const [userType, setUserType] = useState<"individual" | "business">(
    "individual"
  );

  return (
    <div className="min-h-screen bg-white">
      <Header userType={userType} onUserTypeChange={setUserType} />
      <FeeCards userType={userType} />
      <FeeCalculator />

      <WhereFeesGo />
      <Footer />
    </div>
  );
}
