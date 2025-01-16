import axios from 'axios';
import { log } from '../utils/solana';

export interface TokenInfo {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI?: string;
  tags: string[];
  extensions?: {
    [key: string]: any;
  };
}

export type TokenList = {
  [address: string]: TokenInfo;
};

export const fetchTokens = async (tag: 'verified' | 'unknown' = 'verified'): Promise<TokenList> => {
  try {
    log('Fetching tokens with tag:', tag);
    const response = await axios.get(`https://tokens.jup.ag/tokens?tags=${tag}`);
    log(`Successfully fetched ${Object.keys(response.data).length} ${tag} tokens`);
    return response.data;
  } catch (error) {
    log('Error fetching tokens:', error);
    throw new Error(`Failed to fetch ${tag} tokens from Jupiter`);
  }
};

export const getAllTokens = async (): Promise<TokenList> => {
  try {
    const [verifiedTokens, unknownTokens] = await Promise.all([
      fetchTokens('verified'),
      fetchTokens('unknown')
    ]);

    // Merge both token lists
    const allTokens = {
      ...verifiedTokens,
      ...unknownTokens
    };

    log(`Successfully fetched total ${Object.keys(allTokens).length} tokens`);
    return allTokens;
  } catch (error) {
    log('Error fetching all tokens:', error);
    throw new Error('Failed to fetch tokens from Jupiter');
  }
};
