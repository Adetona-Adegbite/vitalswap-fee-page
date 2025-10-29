
interface UserTypeToggleProps {
  userType: 'individual' | 'business';
  onToggle: (type: 'individual' | 'business') => void;
}

const UserTypeToggle = ({ userType, onToggle }: UserTypeToggleProps) => {
  return (
    <div className="flex justify-center mb-12">
      <div className="bg-white rounded-full p-2 shadow-lg border border-gray-200">
        <div className="flex">
          <button
            onClick={() => onToggle('individual')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
              userType === 'individual'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Individual
          </button>
          <button
            onClick={() => onToggle('business')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
              userType === 'business'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Business
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeToggle;
