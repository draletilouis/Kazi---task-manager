import { getPasswordStrength } from '../../utils/validation';

const PasswordStrengthMeter = ({ password }) => {
  const { strength, label, color } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-300`}
            style={{ width: `${(strength / 4) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600 min-w-[60px]">
          {label}
        </span>
      </div>
      <div className="text-xs text-gray-500 space-y-1">
        {password.length < 8 && <p>• At least 8 characters</p>}
        {!/[a-z]/.test(password) && <p>• One lowercase letter</p>}
        {!/[A-Z]/.test(password) && <p>• One uppercase letter</p>}
        {!/[0-9]/.test(password) && <p>• One number</p>}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
