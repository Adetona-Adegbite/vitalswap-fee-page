
const Footer = () => {
  return (
    <footer className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="text-3xl font-bold mr-4" style={{ fontFamily: 'Pacifico, serif' }}>
            VitalSwap
          </div>
          <span className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Global swaps, local ease
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Terms
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Contact
          </a>
          <a
            href="https://readdy.ai/?origin=logo"
            className="text-gray-500 hover:text-blue-600 transition-colors duration-300 text-sm cursor-pointer"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Website Builder
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
