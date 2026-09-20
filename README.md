# Troth

Multi-milestone smart contract escrow on Arc Layer 1 with native USDC gas and sub-second settlement.

[Live App](https://trytroth.netlify.app) · [Demo Video](https://trytroth.netlify.app/demo-video.mp4) · [Arc Mainnet Contract](https://arc.etherscan.io/address/0xF7A20db6E51171263856f282ed188f795206d649) · [GitHub Repo](https://github.com/A-Raphie/troth) · [How It Works](#the-problem--the-arc-thesis)

Freelancers lose 10%–20% of their earnings to platform rakes and risk client ghosting; Troth locks milestone USDC in Solidity escrows on Arc Layer 1 and settles payouts in 350 milliseconds with zero platform fees.

[![Live App](https://img.shields.io/badge/Live%20App-trytroth.netlify.app-004ef5?style=flat-square)](https://trytroth.netlify.app)
[![Demo Video](https://img.shields.io/badge/Demo%20Video-Streamable%20MP4-red?style=flat-square)](https://trytroth.netlify.app/demo-video.mp4)
[![Arc L1](https://img.shields.io/badge/Arc%20L1-Chain%205042-emerald?style=flat-square)](https://rpc.mainnet.arc.io)
[![Foundry Tests](https://img.shields.io/badge/Foundry%20Tests-11%2F11%20Passing-success?style=flat-square)](https://github.com/A-Raphie/troth)

Built for the **Arc Microgrants (Circle / DoraHacks)** — [dorahacks.io/hackathon/arc-microgrants](https://dorahacks.io/hackathon/arc-microgrants).

![Troth Escrow Interface](public/demo-preview.png)

---

## Proof & Live Endpoints

- **Live Production App:** [https://trytroth.netlify.app](https://trytroth.netlify.app)
- **Demo Video (Streamable MP4):** [https://trytroth.netlify.app/demo-video.mp4](https://trytroth.netlify.app/demo-video.mp4)
- **Arc Mainnet Contract:** [`0xF7A20db6E51171263856f282ed188f795206d649`](https://arc.etherscan.io/address/0xF7A20db6E51171263856f282ed188f795206d649) (Chain ID `5042`)
- **Public Verification (No Wallet Required):** [https://trytroth.netlify.app/agreement/104](https://trytroth.netlify.app/agreement/104)
- **Deployment Transaction:** [`0x9c92d4fd...cec4f`](https://arc.etherscan.io/tx/0x9c92d4fd7df78c39d23713ac179841984a49f2aedb6efe3e1175d896ebdcec4f)
- **Foundry Unit Tests:** 11/11 passing (`contracts/test/TrothEscrow.t.sol`)
- **Settlement Latency:** ~350ms deterministic finality via Arc Malachite BFT consensus engine
- **Platform Fee:** 0% platform rake vs 10%–20% on Upwork and Fiverr
- **Arc Mainnet RPC:** `https://rpc.mainnet.arc.io` (Chain ID `5042`)
- **Arc Testnet RPC:** `https://rpc.testnet.arc.io` (Chain ID `5042002`)

---

## The Problem & The Arc Thesis

Freelancers and clients currently face a broken tradeoff:
1. **Web2 Freelance Platforms (Upwork, Fiverr):** Take predatory 10%–20% rake fees, impose 7- to 14-day clearance delays, and maintain centralized power to arbitrarily freeze funds or grant chargebacks.
2. **Traditional Web3 Escrows (Ethereum, Arbitrum, Base):** Force non-crypto users to manage volatile native gas tokens (ETH) to receive stablecoins, face high and erratic gas spikes, and lack the sub-second finality required for smooth checkout experiences.

### **Why Arc Changes Everything**
Troth is purpose-built for the **Arc Layer 1 network**:
* **USDC As Native Gas:** All transaction fees are paid natively in USDC (~$0.0001 per transaction). Users and autonomous agents never touch a volatile token.
* **Sub-Second Finality:** Powered by the Malachite BFT consensus engine, milestone releases settle deterministically in **~350 milliseconds**, making payments feel as fast as a Web2 credit card click with full cryptographic finality.
* **Mutual Anti-Ghosting Safeguards:** Codifies battle-tested dual-timer protection directly in Solidity: contractors can auto-release funds if clients become unresponsive after work submission (review window), and clients can reclaim 100% of escrowed funds if contractors miss milestone delivery deadlines.

---

## High-Trust Minimalist Fintech Design

Troth features a calm, institutional design language inspired by modern fintech infrastructure (Stripe, Mercury, Linear):
* Monochromatic deep zinc palette with crisp contrast and hairline borders (`border-zinc-200/80`).
* Tabular figures (`font-mono font-medium`) for transparent milestone amounts.
* Interactive live escrow simulator on the landing page demonstrating upfront lock, milestone submission, and sub-second release.
* Zero distraction, zero fluff: pure focus on financial safety, verifiable deliverable hashes, and deterministic payment settlement.

---

## Key Features

- **Multi-Milestone Escrow:** Break any agreement into 1 to $N$ discrete tranches with individual USDC payouts and deadlines.
- **Dual Recipient Modes:**
  - *Direct Assignment:* Assign specific contractor wallet address (`0x...`).
  - *Shareable Claim Link:* Generate a secret claim link (`bytes32 claimHash`) so the client can fund escrow before the contractor even connects a wallet.
- **Mutual Anti-Ghosting Protection:** Dual-timer architecture protects both parties: freelancers can auto-release funds after review window (default 7 days) if client ghosts, and clients can reclaim 100% of unsubmitted funds if contractor misses milestone deadline.
- **Mutual & Unclaimed Cancellation:** Clients can cancel unclaimed invite escrows for a 100% refund; contractors can refund unreleased tranches if unable to finish.
- **Zero Platform Rake:** 100% peer-to-peer smart contract escrow.

## Arc Mainnet Deployment

- **Contract Address:** [`0xF7A20db6E51171263856f282ed188f795206d649`](https://arc.etherscan.io/address/0xF7A20db6E51171263856f282ed188f795206d649)
- **Deployment Transaction:** [`0x9c92d4fd...cec4f`](https://arc.etherscan.io/tx/0x9c92d4fd7df78c39d23713ac179841984a49f2aedb6efe3e1175d896ebdcec4f)
- **Chain ID:** `5042` (Arc Mainnet)
- **Native Gas Token:** `USDC`

---

## Smart Contract Verification (`TrothEscrow.sol`)

All contract logic has been implemented with OpenZeppelin `IERC20` and `ReentrancyGuard` and verified with Foundry:

```bash
$ forge test
[PASS] test_AutoReleaseWhenPayerGhosts() (gas: 831801)
[PASS] test_CancelUnclaimedInviteLink() (gas: 507966)
[PASS] test_ContractorRefundUnreleased() (gas: 875035)
[PASS] test_CreateAgreementDirect() (gas: 632701)
[PASS] test_CreateAndClaimViaInviteLink() (gas: 595497)
[PASS] test_PayerClaimDeadlineRefundSuccess() (gas: 686710)
[PASS] test_RevertIfClaimRefundAfterSubmission() (gas: 653965)
[PASS] test_RevertIfClaimRefundBeforeDeadline() (gas: 551631)
[PASS] test_RevertIfNonPayerClaimsDeadlineRefund() (gas: 546784)
[PASS] test_RevisionRequestResetsWindow() (gas: 866488)
[PASS] test_SubmitAndPayerApprove() (gas: 1125481)
Suite result: ok. 11 passed; 0 failed; 0 skipped
```

---

## Tech Stack & Architecture

- **Blockchain:** Arc Mainnet (Chain ID `5042`, RPC `https://rpc.mainnet.arc.io`, Currency `USDC`)
- **Smart Contracts:** Solidity `0.8.28`, Foundry, OpenZeppelin Contracts v5
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Web3 Connectivity:** `wagmi` v2, `viem`, `@tanstack/react-query`
- **Hosting:** Netlify (100% client-rendered prebuilt static export, zero persistent server daemons, live at [trytroth.netlify.app](https://trytroth.netlify.app))

---

## Quick Start

### 1. Live Production Deployment
The application is deployed and live on Netlify:
- **Production URL:** [https://trytroth.netlify.app](https://trytroth.netlify.app)

### 2. Smart Contracts (Foundry)
```bash
cd contracts
forge test
```

### 3. Local Development (Optional)
To run Troth locally from source:
```bash
pnpm install # or bun install
pnpm dev     # or bun dev
```
The local development server runs at `http://localhost:3000`.

---

## License
MIT License. Built with pride for the Arc & Circle ecosystem.
