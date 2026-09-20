# Troth — DoraHacks Arc Microgrants Submission

> **Event:** Arc Microgrants (Circle / DoraHacks)  
> **Track:** Arc Layer 1 Infrastructure & Consumer Applications  
> **Project Name:** Troth  
> **Tagline:** Trustless, multi-milestone escrow on Arc L1 with native USDC gas and sub-second settlement.

---

## Quick Links

| Surface | Link |
| :--- | :--- |
| **Live Web App** | [https://trytroth.netlify.app](https://trytroth.netlify.app) |
| **Demo Video (Streamable MP4)** | [https://trytroth.netlify.app/demo-video.mp4](https://trytroth.netlify.app/demo-video.mp4) |
| **Public GitHub Repo** | [https://github.com/A-Raphie/troth](https://github.com/A-Raphie/troth) |
| **Arc Mainnet Contract** | [`0xF7A20db6E51171263856f282ed188f795206d649`](https://arc.etherscan.io/address/0xF7A20db6E51171263856f282ed188f795206d649) |
| **Public Escrow Verification** | [https://trytroth.netlify.app/agreement/104](https://trytroth.netlify.app/agreement/104) |
| **Deployment Tx** | [`0x9c92d4fd...cec4f`](https://arc.etherscan.io/tx/0x9c92d4fd7df78c39d23713ac179841984a49f2aedb6efe3e1175d896ebdcec4f) |
| **Foundry Test Suite** | 11/11 Tests Passing (`contracts/test/TrothEscrow.t.sol`) |
| **Arc Mainnet RPC** | `https://rpc.mainnet.arc.io` (Chain ID `5042`) |
| **Arc Testnet RPC** | `https://rpc.testnet.arc.io` (Chain ID `5042002`) |

---

## 1. Project Description & One-Liner

**One-Liner:**  
Multi-milestone smart contract escrow on Arc Layer 1 with native USDC gas and sub-second settlement.

**Short Description:**  
Troth is a trustless, multi-milestone escrow application purpose-built for the gig economy, remote contractors, and autonomous digital agents. By leveraging Arc Layer 1's native USDC gas model and ~350ms BFT finality, Troth eliminates predatory 10%–20% freelance platform rakes, prevents counterparty ghosting via dual-timer smart contracts, and settles milestone payouts deterministically in the blink of an eye.

---

## 2. The Problem & Inspiration

Freelancers and clients face a broken tradeoff:
1. **Web2 Freelance Marketplaces (Upwork, Fiverr):** Charge aggressive 10% to 20% platform rake, hold contractor payouts in escrow for 5 to 14 days, and arbitrate disputes through opaque corporate intermediaries.
2. **Web3 Direct Crypto Transfers:** Require one party to take 100% of the counterparty risk. Either the client pays upfront and risks contractor ghosting, or the contractor works upfront and risks non-payment.
3. **High Gas Chains (Ethereum L1, legacy L2s):** Gas fees of $1.50 to $15.00 make micro-milestone payments ($5 to $50) completely unviable.

**The Arc Opportunity:**  
Arc provides native USDC gas (~$0.0001 per transaction) and instant deterministic finality (~350ms). Troth turns these Layer 1 capabilities into a trustless escrow engine where funds stay non-custodial, settlements happen in the blink of an eye, and zero percent platform rake is extracted.

---

## 3. What It Does

- **Multi-Milestone Escrow:** Clients lock USDC into an immutable contract split into deliverable tranches (e.g. Milestone 1: $10, Milestone 2: $15).
- **Dual Recipient Binding:**
  - **Direct Address:** Fund an agreement bound directly to a contractor's Arc address.
  - **Claimable Invite Links:** Fund an agreement using a cryptographic hash (`claimHash`); the contractor clicks the link and claims the agreement directly into their wallet without prior coordination.
- **Instant Payout Release:** When a milestone deliverable is approved by the client, funds disburse to the contractor's wallet in ~350ms.
- **Mutual Anti-Ghosting Safeguards:** Battle-tested dual-timer architecture protects both parties: contractors can auto-release funds after the review window (e.g. 7 days) if a client goes unresponsive, and clients can reclaim a 100% refund of locked funds if a contractor misses milestone delivery deadlines.
- **Deterministic Safety Hatches:** Clients can reclaim expired milestones if deadlines lapse or cancel unclaimed invite links for an immediate 100% refund; contractors can voluntarily trigger refunds if unable to fulfill a milestone.

---

## 4. How We Built It (Arc Primitives & Tech Stack)

### Arc Layer 1 Integration
- **Native USDC Gas:** Eliminates the dual-token friction where users must hold both a native gas token (like ETH) and a settlement asset (like USDC). Every transaction on Troth pays gas directly in USDC micro-fractions.
- **Chain Parameters:** Configured for Arc Mainnet (`Chain ID: 5042`, RPC: `https://rpc.mainnet.arc.io`) and Arc Testnet (`Chain ID: 5042002`).

### Smart Contracts (`contracts/`)
- **Language & Framework:** Solidity `0.8.28`, Foundry framework.
- **Security Architecture:** Checks-Effects-Interactions (CEI) pattern throughout, OpenZeppelin `ReentrancyGuard` v5, and safe token transfers.
- **Verification:** 100% passing Foundry test suite (`contracts/test/TrothEscrow.t.sol`) covering creation, invite claiming, milestone submissions, client approvals, review timeout releases, and edge-case reverts.

### Web Application (`troth/`)
- **Framework:** Next.js 16 (App Router), React 19, TypeScript.
- **Styling & Design System:** Tailwind CSS v4, Lucide Icons, High-Trust Minimalist Fintech aesthetic (Mercury/Stripe styling, tabular numeric layouts, zero raw hex sprawl).
- **UI Components:** Harvested and verified UI primitives from `beui.dev`, `beautifului.dev`, and `shadcn/ui`.
- **Web3 Connectivity:** `wagmi` v2, `viem`, `@tanstack/react-query`.
- **Infrastructure:** Client-only static pre-rendering hosted on Netlify CDN (`trytroth.netlify.app`) with zero backend database dependencies.

---

## 5. Challenges Overcome

- **Next.js 16 Static Pre-rendering with Dynamic Route Parameters:** To deploy a completely serverless, zero-maintenance static export to Netlify CDN without vendor lock-in or backend daemons, dynamic routes like `/agreement/[id]` required `generateStaticParams()` while client hooks (`useSearchParams`, `useAccount`) required client-side runtime isolation. We decoupled the route layout using a dedicated `<Suspense>` client component boundary (`AgreementDetailClient.tsx`), enabling seamless static deployment alongside reactive wallet state.
- **Native Gas vs ERC-20 Decimal Handling:** Arc uses USDC natively for gas while standard ERC-20 USDC contracts operate on 6 decimal places (`10^6`). We structured all contract calculations and UI formatters to maintain strict 6-decimal integer accounting while providing formatted dollar representations in the interface.

---

## 6. Accomplishments & Measurable Traction

- **Arc Mainnet Contract Verification:** Deployed and verified on Arc Layer 1 (Chain ID `5042`) at [`0xF7A20db6E51171263856f282ed188f795206d649`](https://arc.etherscan.io/address/0xF7A20db6E51171263856f282ed188f795206d649).
- **Sub-Second Settlement Finality:** ~350ms deterministic milestone release via Arc's Malachite BFT consensus engine.
- **11/11 Foundry Unit Tests Passing (100% Coverage):** Verified contract mechanics against creation, authorization, timeout auto-release, deadline refund clawbacks, revision requests, and unauthorized access attempts.
- **Live Production Deployment:** Live on Netlify at [https://trytroth.netlify.app](https://trytroth.netlify.app) (HTTP 200 across all routes).
- **100% Feature Coverage Video Walkthrough:** 114s comprehensive demo video covering all 9 core features ([streamable MP4](https://trytroth.netlify.app/demo-video.mp4)).
- **Zero-Rake Micro-Escrow Viability:** Demonstrated functional escrow creation with realistic $5–$25 milestone payments where gas costs represent less than 0.01% of the transfer amount, saving contractors 10%–20% compared to Upwork/Fiverr.
- **Full Open-Source Release:** Complete documentation, Foundry setup, and frontend codebase published under MIT License on GitHub at [https://github.com/A-Raphie/troth](https://github.com/A-Raphie/troth).

---

## 7. What We Learned

- Building on Arc highlights how native stablecoin gas fundamentally transforms consumer Web3 onboarding. Removing the requirement for users to bridge ETH or SOL just to pay gas allows non-crypto-native freelancers to receive payments and interact with smart contracts friction-free.
- Time-bounded auto-release mechanisms are essential for decentralized escrow adoption: without them, counterparty risk simply transfers from payment default to communication deadlock.

---

## 8. What's Next for Troth

1. **ERC-4337 Account Abstraction:** Integrate passkey/social login sponsorship so freelancers can receive their first USDC payout without creating an EOA wallet first.
2. **Decentralized Dispute Resolution:** Integrate an on-chain arbitration protocol (e.g. Kleros or custom Arc dispute DAOs) for contested milestones.
3. **Escrow Streaming:** Add real-time per-second USDC streaming (Sablier/Superfluid style) for hourly contractor agreements.

---

## 9. Judging Criteria Mapping

| DoraHacks Criterion | How Troth Satisfies It |
| :--- | :--- |
| **Arc Ecosystem Alignment** | Built specifically around Arc's core differentiators: Native USDC gas and sub-second BFT settlement. |
| **Technical Execution** | Fully tested Solidity contracts (11/11 Foundry tests passing), Next.js 16 App Router frontend, and live Netlify deployment. |
| **Product & UX Design** | High-Trust Minimalist Fintech aesthetic, tabular typography, interactive milestone inspector, and shareable cryptographic claim links. |
| **Real-World Utility** | Directly targets the multi-billion dollar freelance/gig economy, replacing predatory 10%–20% Web2 platform fees. |
| **Open Source Quality** | Clean Git history, MIT license, comprehensive `README.md`, and reproducible Foundry scripts. |
