import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import axios from 'axios';
import { connection, log } from '../utils/solana';

const HELIUS_API_KEY = '67f88545-2b52-49a0-911b-dd938d7bd94c';
const JUPITER_TOKEN_LIST_URL = 'https://token.jup.ag/strict';

export interface WalletData {
  balance: number;
  tokens: {
    mint: string;
    amount: number;
    decimals: number;
    symbol?: string;
    name?: string;
    logoURI?: string;
  }[];
  recentTransactions: {
    signature: string;
    timestamp: number;
    amount: number;
    type: 'incoming' | 'outgoing';
  }[];
  address: string;
}

export interface ApiError {
  response?: {
    status: number;
    data?: unknown;
  };
  name?: string;
  message?: string;
  code?: string;
  stack?: string;
}

interface JupiterToken {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI?: string;
}

interface TokenData {
  mint: string;
  amount: number;
  decimals?: number;
  symbol?: string;
  name?: string;
  logo?: string;
}

export const fetchWalletData = async (address: string): Promise<WalletData> => {
  const pubKey = new PublicKey(address);
  
  // Fetch Jupiter token list first
  const tokenListResponse = await axios.get(JUPITER_TOKEN_LIST_URL);
  const jupiterTokens = new Map<string, JupiterToken>();
  tokenListResponse.data.forEach((token: JupiterToken) => {
    jupiterTokens.set(token.address, token);
  });

  // Get SOL balance and token balances from Helius
  log('Fetching balances...');
  const balanceResponse = await axios.get(`https://api.helius.xyz/v0/addresses/${pubKey.toString()}/balances`, {
    params: {
      'api-key': HELIUS_API_KEY
    }
  });
  
  const solBalance = balanceResponse.data.nativeBalance;
  const tokens = balanceResponse.data.tokens || [];

  // Log the token data to see what we're getting
  console.log('Token data:', JSON.stringify(tokens, null, 2));

  return {
    balance: solBalance / LAMPORTS_PER_SOL,
    tokens: tokens.map((token: TokenData) => {
      const jupiterToken = jupiterTokens.get(token.mint);
      return {
        mint: token.mint,
        amount: token.amount,
        decimals: token.decimals || jupiterToken?.decimals || 0,
        symbol: token.symbol || jupiterToken?.symbol || '',
        name: token.name || jupiterToken?.name || '',
        logoURI: token.logo || jupiterToken?.logoURI || ''
      };
    }).filter((token: { amount: number }) => token.amount > 0), // Only show tokens with non-zero balance
    recentTransactions: [], // We'll handle transactions separately
    address: pubKey.toString(),
  };
};
