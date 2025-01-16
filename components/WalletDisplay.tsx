import Image from 'next/image';

interface TokenData {
  mint: string;
  amount: number;
  decimals: number;
  symbol?: string;
  name?: string;
  logoURI?: string;
}

interface WalletData {
  balance: number;
  tokens: TokenData[];
  address: string;
}

interface WalletDisplayProps {
  data: WalletData;
}

export default function WalletDisplay({ data }: WalletDisplayProps) {
  // Ensure we have valid data with defaults
  const safeData: WalletData = {
    balance: data?.balance || 0,
    tokens: data?.tokens || [],
    address: data?.address || ''
  };

  return (
    <div className="mt-8 space-y-6">
      {/* SOL Balance Card */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Image
                src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                alt="SOL"
                width={32}
                height={32}
              />
            </div>
            <div>
              <p className="text-sm text-gray-400">SOL Balance</p>
              <p className="text-2xl font-bold">{safeData.balance.toFixed(4)} SOL</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-400">Wallet Address</p>
            <p className="text-sm font-mono">{safeData.address}</p>
          </div>
        </div>
      </div>

      {/* Other Tokens */}
      {safeData.tokens.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Other Tokens</h3>
          <div className="space-y-4">
            {safeData.tokens.map((token) => (
              <div key={token.mint} className="flex justify-between items-center p-3 hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  {token.logoURI ? (
                    <Image
                      src={token.logoURI}
                      alt={token.symbol || 'Token'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center">
                      <span className="text-xs">{token.symbol?.[0] || '?'}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{token.symbol || 'Unknown Token'}</p>
                    <p className="text-sm text-gray-400">{token.name || token.mint}</p>
                  </div>
                </div>
                <p className="font-medium">
                  {(token.amount / Math.pow(10, token.decimals)).toFixed(token.decimals > 4 ? 4 : token.decimals)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
