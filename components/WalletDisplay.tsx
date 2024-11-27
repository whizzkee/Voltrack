interface WalletData {
  balance: number;
  recentTransactions: any[];
  address: string;
}

interface WalletDisplayProps {
  data: WalletData;
}

export default function WalletDisplay({ data }: WalletDisplayProps) {
  return (
    <div className="mt-8">
      {/* Wallet Info */}
      <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Wallet Address */}
          <div>
            <h3 className="text-xl font-semibold text-gray-200 mb-3">Wallet Address</h3>
            <div className="flex items-center space-x-3">
              <p className="font-mono text-sm text-gray-400 break-all">{data.address}</p>
              <button
                className="text-gray-300 hover:text-white transition"
                onClick={() => navigator.clipboard.writeText(data.address)}
                title="Copy Address"
              >
                📋
              </button>
            </div>
          </div>

          {/* Balance */}
          <div>
            <h3 className="text-xl font-semibold text-gray-200 mb-3">Balance</h3>
            <p className="text-3xl font-bold text-white">
              {data.balance.toFixed(4)} <span className="text-lg text-gray-400">SOL</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
