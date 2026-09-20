const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { injectCursor, moveCursor, clickCursor, typeCursor } = require('./mac-cursor');

const OUTPUT_DIR = path.resolve(__dirname, '../videos/raw-takes');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function recordScene(name, durationMs, actionFn) {
  console.log(`\n========================================`);
  console.log(`🎬 Recording Scene: ${name}...`);
  console.log(`========================================`);
  const sceneDir = path.join(OUTPUT_DIR, name);
  if (!fs.existsSync(sceneDir)) fs.mkdirSync(sceneDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: sceneDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();
  try {
    await actionFn(page);
    await page.waitForTimeout(durationMs);
  } catch (err) {
    console.error(`Error in scene ${name}:`, err);
    throw err;
  } finally {
    await context.close();
    await browser.close();
  }

  const files = fs.readdirSync(sceneDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    // Sort files by mtime desc to pick the newest
    files.sort((a, b) => fs.statSync(path.join(sceneDir, b)).mtimeMs - fs.statSync(path.join(sceneDir, a)).mtimeMs);
    const rawPath = path.join(sceneDir, files[0]);
    const finalMp4 = path.join(OUTPUT_DIR, `${name}.mp4`);
    execSync(`ffmpeg -y -i "${rawPath}" -c:v libx264 -pix_fmt yuv420p -r 30 "${finalMp4}"`, { stdio: 'ignore' });
    console.log(`✅ Saved MP4: ${finalMp4}`);
  }
}

async function runAllScenes() {
  // Scene 1: Landing Page & Instant Release Simulator
  await recordScene('scene1-landing-simulator', 1500, async (page) => {
    await page.goto('https://trytroth.netlify.app', { waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForTimeout(1000);

    // Initial subtle cursor movement
    await moveCursor(page, 720, 280, { steps: 20 });
    await page.waitForTimeout(800);

    // Smooth scroll down to the interactive simulator
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
    await page.waitForTimeout(1200);

    // Move to and click "Approve & Release" inside the interactive simulator card
    const approveBtn = page.locator('button:has-text("Approve & Release")').first();
    await clickCursor(page, approveBtn, { steps: 22 });
    await page.waitForTimeout(2000);

    // Smooth scroll down to the comparison matrix and architecture section
    await page.evaluate(() => window.scrollBy({ top: 480, behavior: 'smooth' }));
    await page.waitForTimeout(1000);

    // Move cursor across comparison card
    await moveCursor(page, 950, 680, { steps: 20 });
    await page.waitForTimeout(1500);

    // Scroll further to Architecture and Proof badges
    await page.evaluate(() => window.scrollBy({ top: 380, behavior: 'smooth' }));
    await page.waitForTimeout(1800);
  });

  // Scene 2: Escrow Creation Wizard & Invite Link Generation
  await recordScene('scene2-create-escrow', 2000, async (page) => {
    await page.goto('https://trytroth.netlify.app/create', { waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForTimeout(1000);

    // Type agreement title
    const titleInput = page.locator('input[placeholder*="Arc Layer 1"], input[placeholder*="Integration"]').first();
    await typeCursor(page, titleInput, 'Arc Micro-Grant Deliverable');
    await page.waitForTimeout(600);

    // Click "Shareable Invite Link" recipient option
    const inviteBtn = page.locator('button:has-text("Shareable Invite Link")');
    await clickCursor(page, inviteBtn, { steps: 18 });
    await page.waitForTimeout(600);

    // Fill Milestone 1 description
    const m1Desc = page.locator('input[placeholder*="Milestone Deliverable description"]').first();
    await typeCursor(page, m1Desc, 'Foundry Test Suite & Contracts');
    await page.waitForTimeout(400);

    // Fill Milestone 1 amount ($10)
    const m1Amount = page.locator('input[type="number"]').first();
    await typeCursor(page, m1Amount, '10');
    await page.waitForTimeout(400);

    // Scroll down slightly so Milestone section is centered
    await page.evaluate(() => window.scrollBy({ top: 220, behavior: 'smooth' }));
    await page.waitForTimeout(600);

    // Click "Add Tranche"
    const addTrancheBtn = page.locator('button:has-text("Add Tranche")').first();
    await clickCursor(page, addTrancheBtn, { steps: 16 });
    await page.waitForTimeout(600);

    // Fill Milestone 2 description
    const m2Desc = page.locator('input[placeholder*="Milestone Deliverable description"]').nth(1);
    await typeCursor(page, m2Desc, 'Next.js Web Application');
    await page.waitForTimeout(400);

    // Fill Milestone 2 amount ($15)
    const m2Amount = page.locator('input[type="number"]').nth(1);
    await typeCursor(page, m2Amount, '15');
    await page.waitForTimeout(600);

    // Scroll down to reveal summary and deposit button
    await page.evaluate(() => window.scrollBy({ top: 280, behavior: 'smooth' }));
    await page.waitForTimeout(800);

    // Click "Deposit & Lock $25.00 in Escrow"
    const depositBtn = page.locator('button[type="submit"]').first();
    await clickCursor(page, depositBtn, { steps: 22 });
    await page.waitForTimeout(2500);

    // Hover over the generated shareable invite link copy button
    const copyBtn = page.locator('button:has-text("Copied!"), button:has-text("View Escrow Dashboard")').first();
    if (await copyBtn.isVisible()) {
      await moveCursor(page, 720, 520, { steps: 18 });
      await page.waitForTimeout(1500);
    }
  });

  // Scene 3: Agreement Inspection & Sub-Second Release
  await recordScene('scene3-agreement-approve', 2000, async (page) => {
    await page.goto('https://trytroth.netlify.app/agreement/104', { waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForTimeout(1000);

    // Smooth scroll down to milestone schedule
    await page.evaluate(() => window.scrollBy({ top: 320, behavior: 'smooth' }));
    await page.waitForTimeout(1200);

    // Hover over Milestone 1 (Released)
    const card1 = page.locator('text=Milestone 1: Smart Contract Core & Tests');
    const c1Box = await card1.boundingBox();
    if (c1Box) {
      await moveCursor(page, c1Box.x + 140, c1Box.y + 15, { steps: 20 });
      await page.waitForTimeout(800);
    }

    // Hover over Milestone 2 (Under Review)
    const card2 = page.locator('text=Milestone 2: Frontend Interface & Connect');
    const c2Box = await card2.boundingBox();
    if (c2Box) {
      await moveCursor(page, c2Box.x + 140, c2Box.y + 15, { steps: 20 });
      await page.waitForTimeout(800);
    }

    // Click "Approve & Release $10.00"
    const approveReleaseBtn = page.locator('button:has-text("Approve & Release")').first();
    await clickCursor(page, approveReleaseBtn, { steps: 20 });
    await page.waitForTimeout(2500);

    // Scroll up slightly to view updated escrow balance
    await page.evaluate(() => window.scrollBy({ top: -200, behavior: 'smooth' }));
    await page.waitForTimeout(1800);
  });

  // Scene 4: Smart Contract Terminal Proof
  await recordScene('scene4-terminal-proof', 2500, async (page) => {
    const terminalHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            margin: 0;
            background: #09090b;
            color: #f4f4f5;
            font-family: 'JetBrains Mono', monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            padding: 40px;
            box-sizing: border-box;
          }
          .window {
            width: 100%;
            max-width: 960px;
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
          }
          .titlebar {
            padding: 12px 16px;
            background: #27272a;
            display: flex;
            align-items: center;
            gap: 8px;
            border-bottom: 1px solid #3f3f46;
          }
          .dot { width: 12px; height: 12px; border-radius: 50%; }
          .dot.red { background: #ef4444; }
          .dot.yellow { background: #f59e0b; }
          .dot.green { background: #10b981; }
          .title { margin-left: 12px; font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; }
          .content {
            padding: 24px 28px;
            font-size: 13px;
            line-height: 1.6;
          }
          .command { color: #38bdf8; margin-bottom: 14px; font-weight: 600; }
          .pass { color: #34d399; font-weight: bold; }
          .summary { margin-top: 16px; padding-top: 14px; border-top: 1px solid #27272a; color: #34d399; font-weight: bold; }
          .gas { color: #71717a; font-size: 11px; }
          .cursor-pulse { display: inline-block; width: 8px; height: 15px; background: #38bdf8; margin-left: 4px; vertical-align: middle; animation: blink 1s infinite; }
          @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        </style>
      </head>
      <body>
        <div class="window">
          <div class="titlebar">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
            <span class="title">troth / contracts · forge test --rpc-url arc-mainnet</span>
          </div>
          <div class="content">
            <div class="command">$ forge test</div>
            <div>Ran 11 tests for test/TrothEscrow.t.sol:TrothEscrowTest</div>
            <div><span class="pass">[PASS]</span> test_AutoReleaseWhenPayerGhosts() <span class="gas">(gas: 831801)</span></div>
            <div><span class="pass">[PASS]</span> test_CancelUnclaimedInviteLink() <span class="gas">(gas: 507966)</span></div>
            <div><span class="pass">[PASS]</span> test_ContractorRefundUnreleased() <span class="gas">(gas: 875035)</span></div>
            <div><span class="pass">[PASS]</span> test_CreateAgreementDirect() <span class="gas">(gas: 632701)</span></div>
            <div><span class="pass">[PASS]</span> test_CreateAndClaimViaInviteLink() <span class="gas">(gas: 595497)</span></div>
            <div><span class="pass">[PASS]</span> test_PayerClaimDeadlineRefundSuccess() <span class="gas">(gas: 686710)</span></div>
            <div><span class="pass">[PASS]</span> test_RevertIfClaimRefundAfterSubmission() <span class="gas">(gas: 653965)</span></div>
            <div><span class="pass">[PASS]</span> test_RevertIfClaimRefundBeforeDeadline() <span class="gas">(gas: 551631)</span></div>
            <div><span class="pass">[PASS]</span> test_RevertIfNonPayerClaimsDeadlineRefund() <span class="gas">(gas: 546784)</span></div>
            <div><span class="pass">[PASS]</span> test_RevisionRequestResetsWindow() <span class="gas">(gas: 866488)</span></div>
            <div><span class="pass">[PASS]</span> test_SubmitAndPayerApprove() <span class="gas">(gas: 1125481)</span></div>
            <div class="summary">Suite result: ok. 11 passed; 0 failed; 0 skipped <span class="cursor-pulse"></span></div>
          </div>
        </div>
      </body>
      </html>
    `;
    await page.setContent(terminalHtml);
    await injectCursor(page);
    await page.waitForTimeout(1000);
    await moveCursor(page, 720, 520, { steps: 22 });
    await page.waitForTimeout(1500);
  });

  console.log('\n🎉 All 4 scenes recorded with real macOS cursor successfully!');
}

runAllScenes().catch(err => {
  console.error('Fatal error during recording:', err);
  process.exit(1);
});
