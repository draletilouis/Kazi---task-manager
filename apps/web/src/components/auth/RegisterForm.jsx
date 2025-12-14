import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import PasswordStrengthMeter from '../common/PasswordStrengthMeter';

const RegisterForm = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch('password');

  const handleFormSubmit = async (data) => {
    try {
      setError('');
      await onSubmit(data.email, data.password, data.name);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
          Full name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          })}
          className={`block w-full px-3.5 py-2.5 border ${
            errors.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:border-green-500 focus:ring-green-500'
          } rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors duration-200 text-slate-900 bg-white`}
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address'
            }
          })}
          className={`block w-full px-3.5 py-2.5 border ${
            errors.email
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:border-green-500 focus:ring-green-500'
          } rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors duration-200 text-slate-900 bg-white`}
          placeholder="you@company.com"
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain uppercase, lowercase, and number'
              }
            })}
            className={`block w-full px-3.5 py-2.5 pr-10 border ${
              errors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-300 focus:border-green-500 focus:ring-green-500'
            } rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors duration-200 text-slate-900 bg-white`}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        <PasswordStrengthMeter password={password} />
        {errors.password && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
          Confirm password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value =>
                value === password || 'Passwords do not match'
            })}
            className={`block w-full px-3.5 py-2.5 pr-10 border ${
              errors.confirmPassword
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-300 focus:border-green-500 focus:ring-green-500'
            } rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors duration-200 text-slate-900 bg-white`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3.5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </button>
    </form>
  );
};

export default RegisterForm;