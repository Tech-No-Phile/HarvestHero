<div align="center">

![HarvestHero Banner](./assets/banner.png)

# HarvestHero

**An agricultural marketplace built on trust — where every trade is verified on-chain.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Hardhat](https://img.shields.io/badge/Hardhat-Ethereum-F7DF1E?logo=ethereum&logoColor=black)](https://hardhat.org)


</div>


---

## Why HarvestHero?

Agriculture has a trust problem. Farmers sell without knowing who's buying. Vendors buy without knowing what they're getting. Deals happen on handshakes with no paper trail. When disputes come up, there's nothing to fall back on.

HarvestHero started from a simple question: what if every crop transaction had an immutable, public record that neither party could tamper with?

The result is a role-based marketplace where farmers list harvests, vendors buy them, landowners manage their land — and every purchase is permanently recorded on the Ethereum blockchain.

---

## What's Inside

HarvestHero has three moving parts:

**A React frontend** with separate dashboards per role, a live marketplace, and real-time stats. Built with Tailwind CSS and Framer Motion for a clean, responsive experience.

**An Express backend** that handles authentication, harvest/land CRUD, and purchase logic. MongoDB stores all user and harvest data. JWT secures every protected route.

**A Solidity smart contract** deployed on a local Hardhat node. Every time a vendor purchases a harvest, the backend calls `recordTransfer()` on-chain — storing the harvest ID, farmer address, vendor address, and price permanently.

---

## Roles & Dashboards

<!--  (1200x600px) -->
<!-- ![Dashboard Screenshots](./assets/dashboards.png) -->

| Role | Access | Core Actions |
|------|--------|-------------|
| 🧑‍🌾 Farmer | `/farmer` | Create harvests, track sales, view revenue |
| 🏪 Vendor | `/vendor` | Browse marketplace, purchase harvests, view spend |
| 🏡 Landowner | `/landowner` | List land, manage parcels |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Blockchain | Solidity, Hardhat, Ethers.js v5 |
| Dev Tools | Vite, dotenv, cors |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB — local instance or [MongoDB Atlas](https://mongodb.com/atlas)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/harvest-hero.git
cd harvest-hero
```

### 2. Configure the server

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CONTRACT_ADDRESS=         # Fill after deploying the smart contract
```

### 3. Set up the blockchain

Open two terminals:

```bash
# Terminal 1 — spin up a local Hardhat node
npx hardhat node
```

```bash
# Terminal 2 — deploy the smart contract
npx hardhat run scripts/deploy.js --network localhost
```

Copy the contract address printed in Terminal 2 and paste it into `CONTRACT_ADDRESS` in your `.env`.

### 4. Start the server

```bash
npm run dev
```

### 5. Set up and run the client

```bash
cd ../client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and register as a farmer, vendor, or landowner.

---

## Project Structure

```
harvest-hero/
├── client/
│   └── src/
│       ├── pages/          # Landing, Login, Register, role dashboards
│       ├── context/        # AuthContext (user session)
│       ├── components/     # ProtectedRoute and shared components
│       └── utils/          # Axios instance (api.js)
├── server/
│   ├── routes/             # authRoutes, harvestRoutes, landRoutes, blockchainRoutes
│   ├── config/             # MongoDB connection, blockchain init
│   └── scripts/            # Hardhat deploy script
├── assets/                 # Screenshots and images for this README
├── CONTRIBUTING.md
└── README.md
```

---

## API Reference

<details>
<summary>Auth</summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user with a role |
| POST | `/api/auth/login` | — | Login and receive a JWT |
| GET | `/api/auth/me` | ✅ | Get the current authenticated user |

</details>

<details>
<summary>Harvests</summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/harvests` | ✅ | List all harvests |
| GET | `/api/harvests/my` | ✅ Farmer | Get the logged-in farmer's harvests |
| POST | `/api/harvests` | ✅ Farmer | Create a new harvest listing |
| PUT | `/api/harvests/:id/purchase` | ✅ Vendor | Purchase a harvest |
| DELETE | `/api/harvests/:id` | ✅ Farmer | Delete an available harvest |

</details>

<details>
<summary>Land & Blockchain</summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/lands` | ✅ | List all land parcels |
| POST | `/api/lands` | ✅ Landowner | Create a land listing |
| GET | `/api/blockchain` | ✅ | Check blockchain connection status |

</details>

---

## How the Blockchain Integration Works

<!-- ![Blockchain Flow](./assets/blockchain-flow.png) -->

When a vendor clicks **Purchase Now**:

1. The Express backend validates the request and updates the harvest status in MongoDB
2. It then calls `recordTransfer()` on the deployed Solidity contract, passing the harvest ID, farmer wallet address, vendor wallet address, and price
3. The transaction hash returned from the contract is saved alongside the harvest record in MongoDB
4. The frontend displays a `⛓️ Blockchain Verified` badge on any harvest with a valid transaction hash

If the blockchain call fails (e.g. the local node is down), the purchase still completes in MongoDB — the hash is stored as `blockchain_error` and no badge is shown.

---

## Roadmap

- [ ] Bidding and price negotiation between farmers and vendors
- [ ] SMS/email notifications on purchase
- [ ] Mobile app (React Native)
- [ ] Hindi, Marathi, and Tamil language support
- [ ] Weather and yield analytics per crop
- [ ] Government subsidy scheme integration
- [ ] QR code scanning for in-field harvest verification
- [ ] Testnet deployment (Sepolia / Mumbai)

---

## Contributing

Contributions are what make open source worth building. Whether it's fixing a bug, suggesting a feature, or improving the docs — all of it matters.

Read the full guidelines in [CONTRIBUTING.md](CONTRIBUTING.md) before getting started.

---
<!--
## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---
-->

<div align="center">

Built for the Awesome farmers. Powered by code.

</div>