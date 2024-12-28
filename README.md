# VolTrack - Solana Wallet Transaction Tracker

A Next.js application that allows users to track and analyze transactions for Solana wallets.

## Features

- Track Solana wallet transactions
- View transaction history
- Real-time wallet balance updates
- Clean and modern UI built with TailwindCSS

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (comes with Node.js)

## Getting Started

1. Clone the repository:
```bash
git clone [your-repository-url]
cd voltrack
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Tech Stack

- **Framework**: Next.js 15.0.3
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Blockchain Integration**: @solana/web3.js
- **API Calls**: Axios
- **UI Components**: React 19.0

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable React components
  - `LoadingSpinner.tsx` - Loading animation component
  - `WalletForm.tsx` - Wallet input form component
  - `WalletDisplay.tsx` - Wallet information display component
- `/public` - Static assets
- `/styles` - Global styles and TailwindCSS configuration

## Development

The application uses Next.js's App Router and is built with TypeScript for type safety. To start developing:

1. Make changes to the code
2. The page will auto-update as you edit files
3. Use `npm run lint` to check for any code style issues

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[Your License Here]
