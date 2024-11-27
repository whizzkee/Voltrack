import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface WalletFormProps {
  onSubmit: (address: string) => Promise<void>;
  isLoading: boolean;
}

export default function WalletForm({ onSubmit, isLoading }: WalletFormProps) {
  const [walletAddress, setWalletAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(walletAddress);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex gap-4">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter Solana wallet address..."
          className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none text-white placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={isLoading || !walletAddress}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed relative"
        >
          {isLoading ? (
            <>
              <span className="opacity-0">Track</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size="sm" />
              </div>
            </>
          ) : (
            'Track'
          )}
        </button>
      </div>
    </form>
  );
}
