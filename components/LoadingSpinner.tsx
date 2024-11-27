interface LoadingSpinnerProps {
  size?: 'sm' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ size = 'sm', message, fullScreen = false }: LoadingSpinnerProps) {
  const spinnerSize = size === 'sm' ? 'h-5 w-5 border-2' : 'h-12 w-12 border-4';
  
  const spinner = (
    <div className={`animate-spin rounded-full ${spinnerSize} border-purple-500 border-t-transparent`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
          {spinner}
          {message && <p className="text-white">{message}</p>}
        </div>
      </div>
    );
  }

  return spinner;
}
