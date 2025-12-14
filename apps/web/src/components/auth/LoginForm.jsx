import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

const LoginForm = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = async (data) => {
    try {
      setError('');
      await onSubmit(data.email, data.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
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
          className={`block w-full px-3 py-2 border ${
            errors.email
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:border-green-500 focus:ring-green-500'
          } rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors duration-200 text-slate-900 bg-white`}
          placeholder="you@company.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <a href="#" className="text-xs font-medium text-green-600 hover:text-green-700 transition-colors duration-200">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            className={`block w-full px-3 py-2 pr-10 border ${
              errors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-300 focus:border-green-500 focus:ring-green-500'
            } rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors duration-200 text-slate-900 bg-white`}
            placeholder="••••••••"
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
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-300 rounded transition-colors duration-200"
        />
        <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-700">
          Remember me for 30 days
        </label>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-2.5">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
};

export default LoginForm;
