import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-slate-700 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <a
          href="https://vitalswap.com"
          className="flex items-center gap-3 no-underline"
          aria-label="VitalSwap home"
        >
          {/* prefer PNG/SVG for web; fallback to PDF if needed */}
          <picture>
            <source srcSet="/logo-footer.pdf" type="image/svg+xml" />
            <img
              src="/logo-footer.pdf"
              alt="VitalSwap logo"
              className="h-10 w-10 rounded-sm object-contain"
              onError={(e: any) => {
                // fallback if image missing
                e.currentTarget.src = "/logo-footer.pdf";
              }}
            />
          </picture>

          <div className="flex flex-col leading-tight">
            <span
              className="text-lg font-semibold text-gray-900 dark:text-slate-100"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              VitalSwap
            </span>
            <span
              className="text-xs text-gray-600 dark:text-slate-300"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Global swaps, local ease
            </span>
          </div>
        </a>

        <nav
          className="flex items-center gap-4 md:gap-6 flex-wrap"
          aria-label="Footer links"
        >
          <a
            href="#terms"
            className="text-sm text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Terms
          </a>

          <a
            href="#privacy"
            className="text-sm text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Privacy
          </a>

          <a
            href="mailto:contact@vitalswap.com"
            className="text-sm text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Contact
          </a>

          <a
            href="#"
            className="ml-2 inline-flex items-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ fontFamily: "Poppins, sans-serif" }}
            aria-label="Get started"
          >
            Get Started
          </a>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
        <div
          className="text-sm text-gray-600 dark:text-slate-300"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          © {new Date().getFullYear()} VitalSwap — All rights reserved.
        </div>

        <div
          className="text-sm text-gray-600 dark:text-slate-300 flex items-center gap-3"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <span>Built with ❤️ in Lagos</span>
          <span className="hidden md:inline">•</span>
          <a
            href="https://vitalswap.com/status"
            className="text-sm text-gray-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            System status
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
