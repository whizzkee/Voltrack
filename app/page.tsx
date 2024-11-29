'use client';

import { useState } from 'react';
import { PublicKey, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';
import axios from 'axios';
import WalletForm from '../components/WalletForm';
import WalletDisplay from '../components/WalletDisplay';
import LoadingSpinner from '../components/LoadingSpinner';

interface WalletData {
  balance: number;
  recentTransactions: {
    signature: string;
    timestamp: number;
    amount: number;
    type: 'incoming' | 'outgoing';
  }[];
  address: string;
}

interface ApiError {
  response?: {
    status: number;
    data?: unknown;
  };
  name?: string;
  message?: string;
  code?: string;
  stack?: string;
}

// Initialize Solana connection with Helius RPC endpoint
const HELIUS_API_KEY = '67f88545-2b52-49a0-911b-dd938d7bd94c';
const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const connection = new Connection(HELIUS_RPC);

// Add explicit console logging function to ensure it works in Next.js
const log = (...args: unknown[]) => {
  console.log('[Voltrack]:', ...args);
};

const isValidSolanaAddress = (address: string): boolean => {
  log('Validation Start:', { address });

  if (!address) {
    log('Address is empty');
    return false;
  }

  try {
    log('Creating PublicKey...');
    const pubKey = new PublicKey(address);
    log('PublicKey created:', pubKey.toString());
    
    try {
      log('Converting to bytes...');
      const bytes = pubKey.toBytes();
      log('Checking if on curve...');
      const isOnCurve = PublicKey.isOnCurve(bytes);
      log('Curve check result:', isOnCurve);
      return true; // If we got this far, it's a valid address
    } catch (curveErr) {
      log('Curve check failed:', curveErr);
      return false;
    }
  } catch (err) {
    log('PublicKey creation failed:', err);
    return false;
  }
};

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

      log('Address validated, creating PublicKey');
      const pubKey = new PublicKey(trimmedAddress);
      log('Valid PublicKey created:', pubKey.toString());

      try {
        // Get balance directly from Solana
        log('Fetching balance...');
        const balance = await connection.getBalance(pubKey);
        log('Balance fetched:', balance);

        // Get transactions from Helius
        log('Fetching transactions...');
        const txResponse = await axios.get('https://api.helius.xyz/v0/addresses/' + pubKey.toString() + '/transactions', {
          params: {
            'api-key': HELIUS_API_KEY,
            'limit': 10
          }
        });
        log('Transaction response:', txResponse.data);

        setWalletData({
          balance: balance / LAMPORTS_PER_SOL,
          recentTransactions: txResponse.data || [],
          address: pubKey.toString(),
        });
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: unknown) {
      const error = err as ApiError;
      setIsLoading(false);
      log('Error type:', typeof error);
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
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Track Your Solana Wallet</h2>
          <p className="text-gray-400">Enter your wallet address to view balance and recent transactions</p>
        </div>

        <WalletForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        )}

        {/* Wallet Data Display */}
        {walletData && <WalletDisplay data={walletData} />}

        {isLoading && <LoadingSpinner size="lg" message="Loading wallet data..." fullScreen />}
      </main>
    </div>
  );
}
