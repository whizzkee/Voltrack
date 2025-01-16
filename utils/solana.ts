import { Connection, PublicKey } from '@solana/web3.js';

// Initialize Solana connection with Helius RPC endpoint
const HELIUS_API_KEY = '67f88545-2b52-49a0-911b-dd938d7bd94c';
const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
export const connection = new Connection(HELIUS_RPC);

// Add explicit console logging function
export const log = (...args: unknown[]) => {
  console.log('[Voltrack]:', ...args);
};

export const isValidSolanaAddress = (address: string): boolean => {
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
      return true;
    } catch (curveErr) {
      log('Curve check failed:', curveErr);
      return false;
    }
  } catch (err) {
    log('PublicKey creation failed:', err);
    return false;
  }
};
