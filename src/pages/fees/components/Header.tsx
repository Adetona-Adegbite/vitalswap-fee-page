// Header.tsx
import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  userType: "individual" | "business";
  onUserTypeChange: (type: "individual" | "business") => void;
}

export default function Header({ userType, onUserTypeChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 transition-colors">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a
                href="https://vitalswap.com"
                className="flex items-center gap-3"
              >
                <img
                  src="/logo blue.png"
                  alt="VitalSwap Logo"
                  style={{ width: "28%" }}
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#"
                className="text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Personal
              </a>
              <a
                href="#"
                className="text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Business
              </a>
              <a
                href="#"
                className="text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Help
              </a>

              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
                Sign In
              </button>

              <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium whitespace-nowrap">
                Get Started
              </button>

              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 p-2"
                aria-label="Toggle menu"
              >
                <i
                  className={`ri-${isMenuOpen ? "close" : "menu"}-line text-xl`}
                />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                <a
                  href="#"
                  className="text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  Personal
                </a>
                <a
                  href="#"
                  className="text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  Business
                </a>
                <a
                  href="#"
                  className="text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  Help
                </a>
                <div className="flex flex-col space-y-2 pt-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Sign In
                  </button>
                  <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium">
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
          <div className="flex justify-center items-center gap-3 mb-6">
            <span
              className="text-6xl font-bold text-primary"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              pay
            </span>
            <img
              style={{ width: "7%" }}
              src="/Icon Blue.png"
              alt="VitalSwap Icon"
            />
          </div>

          <p
            className="text-4xl font-bold mb-6 text-primary"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Transparent Fees, No Surprises
          </p>

          <p
            className="text-lg text-gray-600 dark:text-slate-100 max-w-3xl mx-auto mb-8"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            At VitalSwap, we believe in simple, honest fees, no hidden charges.
            Every transaction is transparent, every fee is justified.
          </p>

          {/* User Type Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100/60 dark:bg-gray-700/40 p-1 rounded-full inline-flex">
              <button
                onClick={() => onUserTypeChange("individual")}
                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  userType === "individual"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 dark:text-slate-100 hover:text-gray-900 dark:hover:text-white"
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
                    : "text-gray-700 dark:text-slate-100 hover:text-gray-900 dark:hover:text-white"
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
              Adetona @adetona
            </button>

            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-3xl hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
              <FiUserPlus className="text-white text-lg" />
              Ebube @ebube
            </button>

            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-3xl hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
              <FiUserPlus className="text-white text-lg" />
              Musa @musalee
            </button>

            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-3xl hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
              <FiUserPlus className="text-white text-lg" />
              Kolade @kollyaz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
