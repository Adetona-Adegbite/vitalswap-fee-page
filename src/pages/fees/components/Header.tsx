import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
// import logo from "../../../assets/logos/logo Blue.png";
// import payLogo from "../../../assets/logos/Icon Blue.png";

interface HeaderProps {
  userType: "individual" | "business";
  onUserTypeChange: (type: "individual" | "business") => void;
}

export default function Header({ userType, onUserTypeChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              {/* <div
                className="text-2xl font-bold text-blue-600"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                VitalSwap
              </div> */}
              <img
                style={{ width: "30%" }}
                src="/logo blue.png"
                alt="VitalSwap Logo"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Personal
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Business
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Help
              </a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
                Sign In
              </button>
              <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium whitespace-nowrap">
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
              >
                <i
                  className={`ri-${isMenuOpen ? "close" : "menu"}-line text-xl`}
                ></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Personal
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Business
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Help
                </a>
                <div className="flex flex-col space-y-2 pt-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Sign In
                  </button>
                  <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <span
              className="text-6xl font-bold text-gray-900 mb-6"
              style={{
                fontFamily: "Poppins, sans-serif",
                color: "#043061",
              }}
            >
              pay
            </span>
            <img
              style={{
                width: "7%",
              }}
              src="/Icon Blue.png"
              alt="VitalSwap Logo"
            />
          </div>
          <p
            className="text-4xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: "Poppins, sans-serif", color: "#2563EB" }}
          >
            Transparent Fees, No Surprises
          </p>
          <p
            className="text-lg text-gray-600 max-w-3xl mx-auto mb-8"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            At VitalSwap, we believe in simple, honest fees, no hidden charges.
            Every transaction is transparent, every fee is justified.
          </p>

          {/* User Type Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-full inline-flex">
              <button
                onClick={() => onUserTypeChange("individual")}
                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  userType === "individual"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Individual
              </button>
              <button
                onClick={() => onUserTypeChange("business")}
                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  userType === "business"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Business
              </button>
            </div>
          </div>

          {/* Swaptag Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-3xl hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
              <FiUserPlus className="text-white text-lg" />
              Sarah Kim @sarahk_swap
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-3xl hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
              <FiUserPlus className="text-white text-lg" />
              Joe doe @joe_swap
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-3xl hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
              <FiUserPlus className="text-white text-lg" />
              Mike Ade @mikea_vital
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-3xl hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
              <FiUserPlus className="text-white text-lg" />
              Tim Li @tili_swap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
