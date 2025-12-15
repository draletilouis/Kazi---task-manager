import { useToast } from '../../context/ToastContext';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${typeStyles[toast.type]} px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] max-w-[500px] animate-slide-in`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-white hover:text-gray-200 font-bold"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
