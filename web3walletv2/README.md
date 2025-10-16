# Web3 Wallet - Modern & Secure

A modern, feature-rich Web3 wallet application for managing Solana and Ethereum wallets with a beautiful UI and robust security.

## Features

### Core Functionality
- **Create Wallets**: Generate new wallets with secure recovery phrases
- **Import Wallets**: Restore wallets using existing recovery phrases
- **Multi-Chain Support**: Manage both Solana and Ethereum wallets
- **BIP-44 Derivation**: Standard-compliant wallet derivation paths
- **Wallet Management**: Create, view, and delete wallets

### Security
- **AES-256-GCM Encryption**: Military-grade encryption for sensitive data
- **PBKDF2 Key Derivation**: Secure password-based key derivation
- **Local Storage Only**: All data stored locally, never sent to servers
- **Session Management**: Automatic session handling with cookies
- **Password Protection**: Strong password requirements with validation

### User Experience
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Full dark mode support
- **Intuitive Navigation**: Sidebar navigation with collapsible menus
- **Form Validation**: Zod-based validation for all forms
- **Toast Notifications**: Real-time feedback for user actions

### Pages & Routes

#### Public Routes
- `/` - Landing page
- `/onboarding` - Onboarding hub
- `/onboarding/create` - Create new wallet
- `/onboarding/import` - Import existing wallet
- `/onboarding/unlock` - Unlock wallet

#### Protected Routes
- `/wallet` - Dashboard with wallet overview
- `/wallet/[accountNumber]` - Individual wallet details
- `/wallet/solana` - Solana wallets list
- `/wallet/ethereum` - Ethereum wallets list
- `/wallet/settings/general` - General settings
- `/wallet/settings/recovery` - Recovery phrase management
- `/wallet/settings/security` - Security & password management

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **React Hook Form** - Efficient form handling
- **Zod** - Schema validation

### State Management
- **Zustand** - Lightweight state management
- **Zustand Persist** - Automatic state persistence

### Cryptography
- **Web Crypto API** - Native browser cryptography
- **BIP39** - Mnemonic phrase generation
- **BIP44** - Hierarchical deterministic wallets
- **ed25519-hd-key** - Solana key derivation
- **ethers.js** - Ethereum wallet management
- **tweetnacl.js** - Solana cryptography
- **bs58** - Base58 encoding for Solana

### Security
- **PBKDF2** - Password-based key derivation
- **AES-GCM** - Authenticated encryption
- **Middleware** - Route protection and authentication

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Time Setup

1. Visit the landing page
2. Click "Get Started"
3. Choose to create a new wallet or import an existing one
4. Follow the onboarding flow
5. Set a strong password
6. Access your wallet dashboard

## Usage

### Creating a Wallet
1. Go to `/onboarding/create`
2. Generate a recovery phrase
3. Confirm you've saved it
4. Set a password
5. Your wallet is ready!

### Importing a Wallet
1. Go to `/onboarding/import`
2. Enter your recovery phrase
3. Set a password
4. Your wallets are restored!

### Managing Wallets
- View all wallets on the dashboard
- Click on a wallet to see detailed information
- Copy public addresses and private keys
- View wallet derivation paths and statistics

### Security Settings
- Change your password in Settings > Security
- View your recovery phrase in Settings > Recovery
- Wipe all wallets in Settings > Security (irreversible)

## Security Considerations

### Best Practices
- Never share your recovery phrase or private keys
- Use a strong, unique password
- Store your recovery phrase in a safe place
- Regularly backup your recovery phrase
- Use this wallet on trusted devices only

### Data Storage
- All data is encrypted with AES-256-GCM
- Encryption keys are derived from your password using PBKDF2
- Data is stored only in browser's localStorage
- No data is sent to external servers

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character

## Architecture

### File Structure
```bash
app/
├── page.tsx                 # Landing page
├── layout.tsx              # Root layout
├── onboarding/             # Onboarding flows
│   ├── page.tsx
│   ├── create/
│   ├── import/
│   └── unlock/
└── wallet/                 # Protected wallet routes
    ├── page.tsx            # Dashboard
    ├── [accountNumber]/    # Wallet details
    ├── solana/             # Solana wallets
    ├── ethereum/           # Ethereum wallets
    ├── settings/           # Settings pages
    └── _components/        # Wallet components

lib/
├── validations/
│   └── wallet.schema.ts    # Zod schemas

utils/
├── wallet.flows.util.ts    # Wallet operations
├── wallet.manager.util.ts  # Wallet generation
├── crypto.util.ts          # Encryption/decryption
├── mnemonic.util.ts        # Mnemonic generation
└── local.storage.util.ts   # Storage operations

store/
└── use.wallet.store.ts     # Zustand store

hooks/
├── use-wallet-auth.ts      # Auth hook
└── use-mask-secrets.ts     # Secret masking hook
```

### Key Components
- **WalletCard**: Display individual wallet information
- **WalletsList**: Grid of wallets
- **WalletDetailsDialog**: Detailed wallet information
- **AddWalletDialog**: Add new wallet dialog
- **AppSidebar**: Navigation sidebar

## API Reference

### Wallet Flows
- `startCreateFlow()` - Start wallet creation
- `finalizeCreateWithPassword()` - Finalize wallet creation
- `importWalletWithMnemonic()` - Import wallet
- `unlockWithPassword()` - Unlock wallet
- `onAddWallet()` - Add new wallet
- `onGetWallet()` - Get wallet by ID
- `onDeleteWallet()` - Delete wallet
- `onGetAllWallets()` - Get all wallets
- `onGetRecoveryPhrase()` - Get recovery phrase
- `changePassword()` - Change password
- `resetWithRecoveryPhrase()` - Reset with recovery phrase
- `wipeAllAndShowOnboarding()` - Wipe all data

### Validation Schemas
- `passwordSchema` - Password validation
- `confirmPasswordSchema` - Password confirmation
- `unlockSchema` - Unlock form validation
- `mnemonicSchema` - Mnemonic import validation
- `changePasswordSchema` - Password change validation

## Troubleshooting

### Wallet Not Found
- Ensure you're logged in
- Check if the wallet exists in your account
- Try refreshing the page

### Password Issues
- Ensure password meets requirements
- Check for typos
- Try resetting with recovery phrase

### Import Failed
- Verify recovery phrase is correct
- Ensure words are separated by spaces
- Check for 12 or 24 words

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, please open an issue on the repository or contact the maintainers.

## Disclaimer

This is a demonstration project for educational purposes. Use at your own risk. Always keep your recovery phrase and private keys secure.



<AssistantMessageContentPart partEncoded="eyJ0eXBlIjoidGFzay13YWl0aW5nLXYxIiwiY3JlYXRlZEF0IjoxNzYwNjMwNTQ0MjI2LCJmaW5pc2hlZEF0IjoxNzYwNjMwNTQ0MjI2LCJpZCI6IjNKWFRBbVR3RVpiU054VjMiLCJsYXN0UGFydFNlbnRBdCI6MTc2MDYzMDU0NDIyNiwicGFydHMiOlt7InR5cGUiOiJ0b29sLWNhbGxzIn1dfQ==" />



<AssistantMessageContentPart partEncoded="eyJ0eXBlIjoidGFzay1tYW5hZ2UtdG9kb3MtdjEiLCJpZCI6IlpUMkc4aVhxRWo0OW1yMkEiLCJ0YXNrTmFtZUFjdGl2ZSI6IkNvbXBsZXRpbmcgd2FsbGV0IGJ1aWxkIiwidG9vbENhbGxJZCI6InRvb2x1XzAxVTJDVVBTQm5Xb1d6ZXVyWVZCRmF0MyIsInRhc2tOYW1lQ29tcGxldGUiOiJDb21wbGV0ZWQgd2FsbGV0IHN5c3RlbSIsImNyZWF0ZWRBdCI6MTc2MDYzMDU0NDczNCwiZmluaXNoZWRBdCI6bnVsbCwicGFydHMiOltdLCJsYXN0UGFydFNlbnRBdCI6bnVsbH0=" />
