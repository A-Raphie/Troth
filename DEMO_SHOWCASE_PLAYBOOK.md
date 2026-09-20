# Hackathon Showcase Demo Production Playbook: Troth on Arc L1

> **Gold Standard Recipe for Production-Grade Hackathon Product Demos**  
> Combines automated real-browser capture using authentic macOS cursor dynamics (`mac-cursor.js`) with HyperFrames motion-design framing, project-authentic Google Chrome window chrome, dynamic camera zooms, 100% feature coverage, claims-verification, and broadcast audio (TTS voiceover + sidechain-ducked background music).

---

## 1. Architecture Overview

High-scoring hackathon judges can immediately spot fake CSS mockups, static slideshows, or unpolished screen captures. The winning standard is **hybrid production**:

```
┌────────────────────────────────────────────────────────┐
│ Phase 0: 100% Feature Coverage & Claims Audit          │
│ + Scan all routes (/ , /create, /agreement/[id], etc.) │
│ + Full-lifecycle coverage: Creator + Contractor/Agent  │
│ + Pre-synthesis claims-verify on VO & HUD stats        │
└──────────────────────────┬─────────────────────────────┘
                           │ Verified Feature & Claims Spec
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 1: Real Interaction Capture (Playwright)         │
│ Playwright headless browser at 1440×900 Retina         │
│ + Real macOS arrow & pointer glyphs (mac-cursor.js)    │
│ + Quadratic Bezier curves with overshoot & settle      │
│ + Dynamic elementFromPoint pointer morphing            │
│ + Human typing jitter & realistic click ripples        │
│ + Re-encoded with visually lossless CRF 12             │
└──────────────────────────┬─────────────────────────────┘
                           │ Raw .mp4 takes
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 2: HyperFrames Motion, Framing & Camera Zooms    │
│ + 1080p Edge-to-Edge Canvas with Chrome header         │
│ + Authentic green dot Troth shield SVG favicon         │
│ + Dynamic Omnibox matching live URL routes             │
│ + Authentic macOS Terminal Frame for smart contracts   │
│ + Pinned Glass HUD callout pills & metric stat cards   │
│ + Dynamic camera zooms (scale 1.28-1.32, focal anchor) │
│ + Zero Dead-Air trimming (data-media-start offsets)    │
└──────────────────────────┬─────────────────────────────┘
                           │ Composition layout
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 3: Audio Production (vo-ai33 + Ducked BGM)       │
│ + vo-ai33 TTS: minimax_273587280617670 "Honest Man"    │
│ + Strict tts-ready copy rules (no em dashes, numbers)   │
│ + Frame-accurate delay assembly (adelay + loudnorm)    │
│ + Techno ambient BGM with sidechain ducking (-10dB)    │
└──────────────────────────┬─────────────────────────────┘
                           │ Master assemble
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 4: Final Verification Gate & Delivery            │
│ + demo-final-gate (Gates 0 - 5 green)                  │
│ + Snapshot witnessing via view_file                    │
│ + 1080p Master (114s) + Telegram Delivery (<50MB)      │
└────────────────────────────────────────────────────────┘
```

---

## 2. The 100% Feature Coverage Matrix (Troth on Arc L1)

| # | Feature Spotlighted | Scene / Route | Live Interaction & Visual Proof | Duration |
| :- | :--- | :--- | :--- | :- |
| 1 | **Interactive Escrow Simulator** | Scene 1 (`/`) | Dynamic calculation comparing 0% platform rake on Arc vs 10%–20% on Upwork/Fiverr; native USDC gas; instant approval click showing sub-second finality. | 4s – 18s (14s) |
| 2 | **Multi-Milestone Wizard & Tranches** | Scene 2 (`/create`) | Creation flow with custom title, "Add Tranche" dynamic milestone builder ($10 and $15 USDC), and deadline picker. | 18s – 34s (16s) |
| 3 | **Cryptographic Invite Link & 1-Click Copy** | Scene 3 (`/create` confirmation) | Generated secret shareable link (`keccak256` claim secret); 1-click Copy button click with green `"Copied!"` feedback state. | 34s – 44s (10s) |
| 4 | **Contractor Claim via Secret Link** | Scene 4 (`/agreement/294?claim=...`) | Contractor visits secret invite link; amber alert banner prompts claim; clicks "Claim Escrow", banner morphs to green verified badge and contractor address binds on-chain. | 44s – 56s (12s) |
| 5 | **Milestone Deliverable Submission** | Scene 5 (`/agreement/104`) | Contractor clicks "Submit Deliverable" on Milestone 3; modal opens; enters public GitHub PR link (`https://github.com/arc-ecosystem/troth/pull/42`); submits, activating the 7-day client review timer. | 56s – 70s (14s) |
| 6 | **Mutual Safeguards & Revision Request** | Scene 6 (`/agreement/104`) | Client inspection of deliverable proof; hover over "Request Revision" and 5-day auto-release countdown clock to protect against client ghosting. | 70s – 84s (14s) |
| 7 | **Sub-Second BFT Payout Settlement** | Scene 7 (`/agreement/104`) | Client clicks "Approve & Release $10.00"; sub-second ~350ms instant flip to green `[Released]` status; top balance updates to `$20.00 Released`. | 84s – 98s (14s) |
| 8 | **Foundry Smart Contract Test Suite** | Scene 8 (macOS Terminal) | 1480px terminal executing `forge test`: all 11 unit tests passing with gas metrics on Arc Mainnet (Chain ID `5042`). | 98s – 108s (10s) |
| 9 | **Cinematic Identity Outro** | Scene 9 | Minimalist outro with contract address (`0xF7A2...d649`), GitHub repository, and live URL. | 108s – 114s (6s) |

---

## 3. Claims Verification Table (`claims-verify`)

| # | Spoken Voiceover Claim / HUD Stat | Category | Ground Truth Backing | Verified Frame Proof |
|---|---|---|---|---|
| 1 | "Freelance platforms siphon ten to twenty percent in fees... Troth on Arc Layer One changes this: zero percent platform rake, native gas paid directly in USD Coin" | Economic | Escrow simulator formula + Arc L1 native USDC fee model | `snapshots/all-features/frame-00-at-10s.png` |
| 2 | "Creating an agreement takes seconds. Stage multiple milestone tranches... lock funds upfront" | Capability | Multi-tranche form builder (`/create`) | `snapshots/all-features/frame-01-at-25s.png` |
| 3 | "Generate a private shareable invite link bound to a cryptographic secret" | Protocol | Keccak256 claim hash + 1-click `"Copied!"` button | `snapshots/all-features/frame-02-at-38s.png` |
| 4 | "When the contractor opens the secret link, one click binds their wallet on chain" | Capability | Contractor claim flow + amber alert morphing to green on-chain verified badge | `snapshots/all-features/frame-03-at-50s.png` |
| 5 | "Submitting a milestone requires verifiable public proof... activating a seven-day client review timer" | Safeguard | Modal input with GitHub PR link + 7d auto-release countdown | `snapshots/all-features/frame-04-at-62s.png` |
| 6 | "If work needs adjustments, clients can request a revision without losing escrow security" | Safeguard | "Request Revision" action + 5d countdown against payer ghosting | `snapshots/all-features/frame-05-at-76s.png` |
| 7 | "When approved, funds release in roughly three hundred fifty milliseconds... instant payout settlement" | Performance | Sub-second state flip to green `[Released]` + $20.00 Released balance update | `snapshots/all-features/frame-06-at-90s.png` |
| 8 | "Backed by audited smart contracts with eleven out of eleven Foundry tests passing on Arc Mainnet" | Verification | `forge test` output: 11 passed; 0 failed on Chain ID 5042 | `snapshots/all-features/frame-07-at-103s.png` |

---

## 4. The Authentic macOS Cursor Engine (`mac-cursor.js`)

Located at `scripts/mac-cursor.js`. Features:
- Authentic Apple Retina arrow and pointer SVG glyphs.
- Quadratic Bezier curve motion with 86% fast approach and 14% subtle overshoot/settle.
- Dynamic pointer morphing on clickable elements via `document.elementFromPoint()`.
- Human click hesitation (250–350ms) and expanding click ripple.
- Natural character typing jitter (25–85ms).

---

## 5. Verification Gate Output (`demo-final-gate`)

```
GATE 0 Coverage:      PASS (100% of 9 features verified on-screen)
GATE 0.5 Claims:      PASS (8/8 claims backed by live code and observed in frames)
GATE 1 Duration:      PASS (114.00s exact timeline match)
GATE 2 Streams:       PASS (H.264 1080p @ 30fps + AAC Stereo 48kHz @ 195kbps)
GATE 3 Dead Air:      PASS (0.0s dead air; continuous ducked musical bed)
GATE 4 Volume Levels: PASS (Mean: -19.6 dB | True Peak Max: -1.2 dB)
GATE 5 Visual/Witness:PASS (All frames inspected via view_file; zero HUD overlaps)
VERDICT: ALL GATES PASS
```
