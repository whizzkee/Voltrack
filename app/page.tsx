'use client';

import { useState } from 'react';
import WalletForm from '../components/WalletForm';
import WalletDisplay from '../components/WalletDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { isValidSolanaAddress, log } from '../utils/solana';
import { fetchWalletData, type WalletData, type ApiError } from '../services/walletService';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  const handleSubmit = async (address: string) => {
    log('Form submitted');
    setIsLoading(true);
    setError(null);
    setWalletData(null);

    try {
      const trimmedAddress = address.trim();
      log('Processing address:', trimmedAddress);

      if (!isValidSolanaAddress(trimmedAddress)) {
        throw new Error('Invalid wallet address format');
      }

      try {
        const data = await fetchWalletData(trimmedAddress);
        setWalletData(data);
      } catch (apiError: unknown) {
        const error = apiError as ApiError;
        log('API Error:', error);
        if (error.response?.status === 403) {
          setError('RPC connection error. Please try again in a moment.');
        } else if (error.response?.status === 429) {
          setError('Too many requests. Please try again later.');
        } else {
          setError('Failed to fetch wallet data. Please try again.');
        }
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      setIsLoading(false);
      log('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack,
        response: error.response,
        raw: error
      });

      if (error instanceof Error) {
        log('Standard Error caught:', error.message);
        if (error.message.includes('Invalid Solana wallet address')) {
          setError('Please enter a valid Solana wallet address');
          return;
        }
      }

      setError('Invalid wallet address. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Track Your Solana Wallet</h2>
          <p className="text-gray-400">Enter your wallet address to view balance and recent transactions</p>
        </div>

        <WalletForm onSubmit={handleSubmit} isLoading={isLoading} />

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        )}

        {walletData && <WalletDisplay data={walletData} />}

        {isLoading && <LoadingSpinner size="lg" message="Loading wallet data..." fullScreen />}
      </main>
    </div>
  );
}
