const Footer = () => {
  return (
    <footer className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <a href="https://vitalswap.com">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/logo-footer.pdf" alt="Logo" className="h-8 w-8 mr-3" />
            <p>VitalSwap</p>
            <span
              className="text-gray-600"
              style={{
                fontFamily: "Poppins, sans-serif",
                marginLeft: "10px",
                fontSize: "12px",
              }}
            >
              Global swaps, local ease
            </span>
          </div>
        </a>
        <div className="flex items-center space-x-6">
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Terms
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
