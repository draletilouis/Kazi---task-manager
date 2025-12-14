import { Loader2 } from 'lucide-react';

const Spinner = ({
  size = 'md',        // 'sm' | 'md' | 'lg'
  fullScreen = true,  // Whether to show full screen or inline
  message = ''        // Optional loading message
}) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader2 className={`${sizes[size]} text-blue-600 animate-spin`} />
      {message && (
        <p className="text-sm text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

export default Spinner;
