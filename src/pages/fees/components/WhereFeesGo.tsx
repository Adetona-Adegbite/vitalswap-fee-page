
export default function WhereFeesGo() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Gilroy, sans-serif' }}>
            Where Your Fees Go
          </h2>
          
          {/* Fee Distribution Diagram */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Central 100% Circle */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    100%
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 font-medium">
                    Your Fees
                  </div>
                </div>
              </div>

              {/* Distribution Arrows and Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                {/* Liquidity Providers */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto">
                      60%
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full"></div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    60% Liquidity Providers
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ensuring seamless liquidity
                  </p>
                </div>

                {/* Platform Sustainability */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-lg mx-auto">
                      30%
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full"></div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    30% Platform Sustainability
                  </h3>
                  <p className="text-sm text-gray-600">
                    Development and security
                  </p>
                </div>

                {/* Operations */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto">
                      10%
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"></div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    10% Operations
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customer support & compliance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8" style={{ fontFamily: 'Gilroy, sans-serif' }}>
            Frequently Asked Questions
          </h3>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between cursor-pointer">
                <h4 className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Why does the fee vary by network?
                </h4>
                <i className="ri-arrow-down-s-line text-gray-400"></i>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between cursor-pointer">
                <h4 className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Do you charge hidden fees?
                </h4>
                <i className="ri-arrow-down-s-line text-gray-400"></i>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between cursor-pointer">
                <h4 className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  How can I reduce my fees?
                </h4>
                <i className="ri-arrow-down-s-line text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-shield-check-line text-2xl text-blue-600"></i>
              </div>
              <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Audited by Certik
              </h4>
              <p className="text-sm text-gray-600">
                Security verified by industry leaders
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-lock-line text-2xl text-yellow-600"></i>
              </div>
              <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                SSL Secured
              </h4>
              <p className="text-sm text-gray-600">
                Bank-grade encryption protection
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-group-line text-2xl text-blue-600"></i>
              </div>
              <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Trusted by 10,000+ users
              </h4>
              <p className="text-sm text-gray-600">
                Growing community of traders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
