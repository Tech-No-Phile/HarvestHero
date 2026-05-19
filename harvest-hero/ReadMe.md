# 🌾 HarvestHero

> **A blockchain-powered agricultural marketplace connecting farmers, vendors, and landowners — bringing transparency and trust to crop trading.**
<img src="" />

---

## 🚀 The Problem

Agriculture is plagued by middlemen, opaque pricing, and zero transaction accountability. Farmers get underpaid, vendors overpay, and there's no reliable record of who bought what, when, and for how much.

**HarvestHero fixes this.**

---

## 💡 What It Does

HarvestHero is a full-stack marketplace platform with three distinct user roles:

| Role | What They Can Do |
|------|-----------------|
| 🧑‍🌾 **Farmer** | List harvests with crop name, quantity, and price |
| 🏪 **Vendor** | Browse the marketplace and purchase available harvests |
| 🏡 **Landowner** | Manage and lease land listings |

Every transaction is **recorded on the blockchain**, creating an immutable, verifiable audit trail — no disputes, no fraud, no he-said-she-said.

---

## ✨ Key Features

- 🔐 **Role-based authentication** — Farmers, vendors, and landowners each get a tailored dashboard
- 🌾 **Harvest listings** — Create, manage, and track crop listings with real-time status
- 🛒 **Marketplace** — Vendors can browse and purchase available harvests instantly
- ⛓️ **Blockchain verification** — Every purchase is recorded on-chain via a smart contract
- 📊 **Live dashboards** — Stats on revenue, purchases, and available inventory per role
- 🏡 **Land management** — Landowners can list and manage land parcels

---

## 🛠️ Tech Stack

### Frontend
- **React** + **React Router v6** — SPA with role-based routing
- **Tailwind CSS** — Utility-first styling with a custom dark theme
- **Framer Motion** — Smooth animations and transitions

### Backend
- **Node.js** + **Express** — REST API server
- **MongoDB** + **Mongoose** — Database and ODM
- **JWT** — Secure authentication

### Blockchain
- **Hardhat** — Local Ethereum development environment
- **Ethers.js (v5)** — Smart contract interaction
- **Solidity** — Smart contract for recording harvest transfers on-chain

---

## 📁 Project Structure

```
HarvestHero/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/           # Landing, Login, Register, Dashboards
│   │   ├── context/         # AuthContext
│   │   ├── components/      # ProtectedRoute, shared UI
│   │   └── utils/           # Axios API instance
├── server/                  # Express backend
│   ├── routes/              # Auth, Harvest, Land, Blockchain routes
│   ├── config/              # MongoDB + Blockchain config
│   └── scripts/             # Hardhat deploy scripts
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- MetaMask or any Ethereum wallet (optional, for blockchain features)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/harvest-hero.git
cd harvest-hero
```

### 2. Set up the server
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 3. Set up the blockchain (optional)
```bash
# Terminal 1 — Start local Hardhat node
npx hardhat node

# Terminal 2 — Deploy the smart contract
npx hardhat run scripts/deploy.js --network localhost
```

Add the deployed contract address to your `.env`:
```env
CONTRACT_ADDRESS=your_deployed_contract_address
```

### 4. Start the server
```bash
npm run dev
```

### 5. Set up the client
```bash
cd ../client
npm install
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/harvests` | Get all harvests |
| GET | `/api/harvests/my` | Get farmer's own harvests |
| POST | `/api/harvests` | Create a new harvest |
| PUT | `/api/harvests/:id/purchase` | Purchase a harvest |
| DELETE | `/api/harvests/:id` | Delete a harvest |
| GET | `/api/lands` | Get all land listings |
| GET | `/api/blockchain` | Blockchain status |

---

## 🧠 How Blockchain Works Here

When a vendor purchases a harvest:

1. The backend calls the smart contract's `recordTransfer()` function
2. It records the harvest ID, farmer address, vendor address, and price on-chain
3. The transaction hash is saved to MongoDB alongside the harvest record
4. The frontend displays the `⛓️ Blockchain Verified` badge on the listing

This ensures **every trade is tamper-proof and publicly auditable**.

---

## 🎯 Why HarvestHero?

- **For farmers** — Fair, direct pricing with no middlemen
- **For vendors** — Transparent sourcing with verified provenance
- **For landowners** — Streamlined land management in one platform
- **For everyone** — Blockchain accountability that builds trust across the supply chain

---

## 🛣️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Price negotiation / bidding system
- [ ] Weather and yield analytics integration
- [ ] Multi-language support (Hindi, Marathi, Tamil)
- [ ] Government subsidy integration
- [ ] QR code-based harvest verification

---

## 👥 Team

Built with ❤️ for farmers everywhere.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.