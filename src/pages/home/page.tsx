
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Pacifico, serif' }}>
          VitalSwap
        </h1>
        <p className="text-xl text-gray-600 mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Global swaps, local ease
        </p>
        <Link
          to="/fees"
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer inline-block"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          View Fees & Rates
        </Link>
      </div>
    </div>
  );
};

export default Home;
