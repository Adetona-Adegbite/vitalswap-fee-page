
import { useState } from 'react';

const FeeCalculator = () => {
  const [transactionType, setTransactionType] = useState('');
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Gilroy, sans-serif' }}>
          Estimate Your Fees
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Get an instant estimate of your transaction costs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Transaction Type
          </label>
          <div className="relative">
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <option value="">Select type</option>
              <option value="payout">Payout</option>
              <option value="deposit">Deposit</option>
              <option value="transfer">Transfer</option>
              <option value="fx">Currency Exchange</option>
              <option value="card">Virtual Card</option>
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Currency
          </label>
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <option value="">Select currency</option>
              <option value="USD">USD - US Dollar</option>
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          />
        </div>
      </div>

      <div className="text-center">
        <button
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl opacity-50 cursor-not-allowed whitespace-nowrap"
          style={{ fontFamily: 'Poppins, sans-serif' }}
          disabled
        >
          <i className="ri-calculator-line mr-2"></i>
          Calculate Fees
        </button>
        <p className="text-sm text-gray-500 mt-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Calculator coming soon - for design purposes only
        </p>
      </div>
    </div>
  );
};

export default FeeCalculator;
