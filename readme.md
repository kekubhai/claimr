# Claimrbro

Claimrbro is a digital platform designed to simplify and streamline the process of managing and processing claims through a centralized and user-friendly system.

The project focuses on reducing manual workflows, improving transparency, and providing users with an organized interface for submitting, managing, and tracking claims.

## Overview

Traditional claim management often involves fragmented communication, manual documentation, and limited visibility into the progress of a claim.

Claimrbro aims to address these challenges by providing a centralized platform that brings the relevant workflows into a single digital environment.

The system is designed with simplicity, accessibility, and maintainability in mind.

## Key Features

* Claim creation and submission
* Claim status tracking
* Centralized claim management
* User authentication and authorization
* Structured claim information
* Responsive user interface
* Secure handling of application data
* Scalable application architecture

## Technology Stack

The project is built using modern web technologies.

| Category       | Technology   |
| -------------- | ------------ |
| Frontend       | [Technology] |
| Backend        | [Technology] |
| Database       | [Technology] |
| Authentication | [Technology] |
| Styling        | [Technology] |
| Deployment     | [Technology] |

## System Architecture

```text
                    ┌─────────────────┐
                    │      Client     │
                    │   Web Interface │
                    └────────┬────────┘
                             │
                             │ HTTP / API
                             ▼
                    ┌─────────────────┐
                    │     Backend     │
                    │   Application   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Database    │
                    │     Storage     │
                    └─────────────────┘
```

The frontend communicates with the backend through application APIs. The backend handles business logic, authentication, validation, and data operations before interacting with the underlying database or storage services.

## Project Structure

```text
claimrbro/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
├── public/
├── ...
├── package.json
├── .env.example
└── README.md
```

The exact structure may vary depending on the implementation.

## Getting Started

### Prerequisites

Before running the project locally, ensure that the following are installed:

* Node.js
* npm
* Git
* Required database or external services

### Installation

Clone the repository:

```bash
git clone https://github.com/kekubhai/claimrbro.git
```

Navigate to the project directory:

```bash
cd claimrbro
```

Install the dependencies:

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the project root and configure the required environment variables.

```env
DATABASE_URL=
API_URL=
JWT_SECRET=
```

Do not commit environment files containing credentials or private keys to the repository.

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at the local development URL provided by the development server.

## Development Workflow

A typical development workflow consists of:

```text
Clone Repository
       |
       v
Install Dependencies
       |
       v
Configure Environment
       |
       v
Run Development Server
       |
       v
Develop and Test
       |
       v
Build for Production
       |
       v
Deploy
```

## API

If the application exposes backend APIs, the API layer is responsible for handling application requests, validation, authentication, and communication with the database.

Example endpoint structure:

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| GET    | `/api/claims`     | Retrieve claims           |
| GET    | `/api/claims/:id` | Retrieve a specific claim |
| POST   | `/api/claims`     | Create a claim            |
| PUT    | `/api/claims/:id` | Update a claim            |
| DELETE | `/api/claims/:id` | Delete a claim            |

The endpoint list should be updated according to the actual implementation.

## Security

Security considerations include:

* Authentication and authorization
* Input validation
* Secure environment variable management
* Protected API endpoints
* Appropriate access control
* Secure storage of sensitive information

Production deployments should use HTTPS and appropriate security policies for handling user and application data.

## Future Development

Potential areas for further development include:

* Automated claim verification
* Document processing
* Advanced analytics
* Notification and alert systems
* Role-based access control
* Audit logging
* Fraud detection
* AI-assisted claim analysis
* Improved reporting and administration tools

## Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Implement the required changes.
4. Test the changes locally.
5. Commit your changes with a descriptive commit message.
6. Push the branch to your fork.
7. Open a pull request.

Example:

```bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

## License

This project is currently distributed under the license specified in the repository.

## Author

**Kekubhai**

GitHub: https://github.com/kekubhai

## Smart Contract Address

**Stellar/Soroban Contract ID:** `CAJO3FV7NPDGDIAJVX4ILN54G7W62T5UBGFNVNT44X4KW4GRYQAPA3JZ`

This is the deployed `claimr_verifier` contract on Stellar Futurenet that handles:
- `lock_reward` — escrow reward with commitment hash
- `verify_and_payout` — verify Groth16 BN254 proof, release funds to winner
- `bounty_status` — read bounty lifecycle status
- `nullifier_status` — check if nullifier hash is already spent (double-claim prevention)

## Integration Logic

### 1. Post a Bounty (Lock Reward)

```typescript
import { createAdapter } from "@claimr/zk-settlement";
import { generateClaimProof } from "@claimr/zk-settlement";

const adapter = createAdapter("stellar"); // or "ethereum"

// Poster locks reward with commitment hash (hides actual amount)
const escrowRef = await adapter.lockReward(
  "bounty_123",                              // bountyId
  "0xabc123...",                             // commitmentHash = poseidon(rewardAmount)
  new Uint8Array([...])                      // amountOpaque (encrypted amount for evaluator)
);
```

### 2. AI Evaluation & Signature

Off-chain AI evaluator (Gemini) scores submission and signs:
```typescript
// Backend signs: message = "claimr_winner" || bountyId || winnerWallet
const evaluatorSig = await signMessage(
  `claimr_winner:${bountyId}:${winnerWallet}`,
  evaluatorPrivateKey
);
```

### 3. Winner Generates ZK Proof

```typescript
const { proofBytes, publicSignals } = await generateClaimProof(
  "bounty_123",           // bountyId
  "solver_secret_42",     // solverSecret (preimage of nullifierHash)
  evaluatorSig            // evaluator's signature attesting winner
);

// publicSignals = [bountyId, nullifierHash, evaluatorSignatureHash]
```

### 4. Verify Proof & Claim Reward

```typescript
const txRef = await adapter.verifyAndPayout(
  "bounty_123",
  proofBytes,
  publicSignals
);
// Contract verifies Groth16 via BN254 host functions,
// checks nullifier not spent, transfers asset to winner
```

### 5. Check Status

```typescript
const status = await adapter.getBountyStatus("bounty_123");
// Returns: "active" | "under_review" | "closed" | "refunded"

const isSpent = await adapter.getNullifierStatus("0xnullifier_hash");
// Returns: true if already claimed
```

### Environment Variables

```env
# Settlement chain: "stellar" | "ethereum"
NEXT_PUBLIC_SETTLEMENT_CHAIN=stellar

# Soroban (Stellar)
NEXT_PUBLIC_SOROBAN_CONTRACT_ID=CAJO3FV7NPDGDIAJVX4ILN54G7W62T5UBGFNVNT44X4KW4GRYQAPA3JZ
NEXT_PUBLIC_SOROBAN_RPC_URL=https://rpc-futurenet.stellar.org

# Ethereum (optional)
NEXT_PUBLIC_ETH_RPC_URL=https://rpc.sepolia.org
```

### Running the Integration

```bash
# Install dependencies
cd packages/zk-settlement && npm install
cd apps/frontend && npm install

# Set environment variables
cp .env.example .env
# Edit .env with the values above

# Run frontend
cd apps/frontend && npm run dev

# Build ZK settlement package
cd packages/zk-settlement && npm run build
```

## Repository

[Claimrbro](https://github.com/kekubhai/claimrbro)
