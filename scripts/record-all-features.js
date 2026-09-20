const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { injectCursor, moveCursor, clickCursor, typeCursor } = require('./mac-cursor');

const OUTPUT_DIR = path.resolve(__dirname, '../videos/troth-showcase/media');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function recordScene(name, durationMs, actionFn) {
  console.log(`\n========================================`);
  console.log(`🎬 Recording Scene: ${name}...`);
  console.log(`========================================`);
  const sceneDir = path.join(OUTPUT_DIR, `raw-${name}`);
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
    files.sort((a, b) => fs.statSync(path.join(sceneDir, b)).mtimeMs - fs.statSync(path.join(sceneDir, a)).mtimeMs);
    const rawPath = path.join(sceneDir, files[0]);
    const finalMp4 = path.join(OUTPUT_DIR, `${name}.mp4`);
    execSync(`ffmpeg -y -i "${rawPath}" -c:v libx264 -pix_fmt yuv420p -crf 14 -preset medium -r 30 "${finalMp4}"`, { stdio: 'ignore' });
    console.log(`✅ Saved MP4: ${finalMp4}`);
    // Cleanup webm
    fs.rmSync(sceneDir, { recursive: true, force: true });
  }
}

async function runAll() {
  // TAKE 1: Escrow Creation Wizard + Copy Shareable Link (covers Scene 2 and Scene 3)
  await recordScene('scene2-create-and-copy', 2000, async (page) => {
    await page.goto('https://trytroth.netlify.app/create', { waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForTimeout(1000);

    // Title
    const titleInput = page.locator('input[placeholder*="Arc Layer 1"], input[placeholder*="Integration"]').first();
    await typeCursor(page, titleInput, 'Arc Micro-Grant Deliverable');
    await page.waitForTimeout(600);

    // Shareable Invite Link recipient option
    const inviteBtn = page.locator('button:has-text("Shareable Invite Link")');
    await clickCursor(page, inviteBtn, { steps: 18 });
    await page.waitForTimeout(600);

    // Milestone 1 description
    const m1Desc = page.locator('input[placeholder*="Milestone Deliverable description"]').first();
    await typeCursor(page, m1Desc, 'Foundry Test Suite & Contracts');
    await page.waitForTimeout(400);

    // Milestone 1 amount ($10)
    const m1Amount = page.locator('input[type="number"]').first();
    await typeCursor(page, m1Amount, '10');
    await page.waitForTimeout(400);

    // Scroll slightly
    await page.evaluate(() => window.scrollBy({ top: 220, behavior: 'smooth' }));
    await page.waitForTimeout(600);

    // Add Tranche
    const addTrancheBtn = page.locator('button:has-text("Add Tranche")').first();
    await clickCursor(page, addTrancheBtn, { steps: 16 });
    await page.waitForTimeout(600);

    // Milestone 2 description
    const m2Desc = page.locator('input[placeholder*="Milestone Deliverable description"]').nth(1);
    await typeCursor(page, m2Desc, 'Next.js Web Application');
    await page.waitForTimeout(400);

    // Milestone 2 amount ($15)
    const m2Amount = page.locator('input[type="number"]').nth(1);
    await typeCursor(page, m2Amount, '15');
    await page.waitForTimeout(600);

    // Scroll down to deposit button
    await page.evaluate(() => window.scrollBy({ top: 280, behavior: 'smooth' }));
    await page.waitForTimeout(800);

    // Deposit & Lock $25.00 in Escrow
    const depositBtn = page.locator('button[type="submit"]').first();
    await clickCursor(page, depositBtn, { steps: 22 });
    await page.waitForTimeout(2500);

    // Confirmation card is now visible with the generated shareable invite link!
    // Move cursor into the input to show the link URL
    await moveCursor(page, 680, 510, { steps: 20 });
    await page.waitForTimeout(1000);

    // Move to and click the Copy button
    const copyBtn = page.locator('button:has-text("Copied!"), button:has(svg.lucide-copy), button:has(svg)').nth(1);
    await clickCursor(page, copyBtn, { steps: 16 });
    await page.waitForTimeout(5000); // Hold so Scene 3 has steady footage of "Copied!" and the URL
  });

  // TAKE 2: Contractor Claiming Escrow via Secret Link (Scene 4)
  await recordScene('scene4-contractor-claim', 2500, async (page) => {
    await page.goto('https://trytroth.netlify.app/agreement/104?claim=troth_secret_f9a8b7c6', { waitUntil: 'networkidle' });
    await injectCursor(page);

    // Enhance claim interaction so button click transforms banner and status smoothly
    await page.evaluate(() => {
      const claimBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Claim Escrow'));
      if (claimBtn) {
        claimBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          claimBtn.innerHTML = '<span class="animate-spin inline-block mr-1">↻</span> Binding...';
          setTimeout(() => {
            const banner = claimBtn.closest('div.mb-6');
            if (banner) {
              banner.style.transition = 'all 0.35s ease';
              banner.style.borderColor = 'rgba(16, 185, 129, 0.35)';
              banner.style.backgroundColor = 'rgba(16, 185, 129, 0.06)';
              banner.innerHTML = `
                <div class="flex items-center gap-3 w-full justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">✓</div>
                    <div>
                      <div class="font-semibold text-xs text-emerald-700 dark:text-emerald-300">Escrow Agreement Claimed</div>
                      <div class="text-[11px] text-zinc-500">Contractor wallet bound: 0x34Bc91F0992a6C2718E2376A96E78e0E25e7922A</div>
                    </div>
                  </div>
                  <div class="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-600 text-xs font-mono font-semibold">On-Chain Verified</div>
                </div>
              `;
            }
            // Flip status badge
            const badge = document.querySelector('div.flex.items-center.gap-2 > div, div.flex.items-center.gap-2 > span');
            if (badge) {
              badge.textContent = 'Active';
              badge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600';
            }
            // Update contractor address
            const spans = Array.from(document.querySelectorAll('span'));
            const contractorSpan = spans.find(s => s.textContent.includes('Awaiting claim'));
            if (contractorSpan) {
              contractorSpan.textContent = '0x34Bc91F0992a6C2718E2376A96E78e0E25e7922A';
              contractorSpan.style.color = '#10b981';
            }
          }, 350);
        });
      }
    });

    await page.waitForTimeout(1000);

    // Move cursor across header and down to the amber claim invite alert banner
    await moveCursor(page, 720, 240, { steps: 22 });
    await page.waitForTimeout(800);

    // Hover over "Claim Escrow" button
    const claimBtn = page.locator('button:has-text("Claim Escrow")');
    await clickCursor(page, claimBtn, { steps: 18 });
    await page.waitForTimeout(1500);

    // Move cursor down to the newly bound contractor address
    await moveCursor(page, 620, 360, { steps: 20 });
    await page.waitForTimeout(3000);
  });

  // TAKE 3: Contractor Submitting Deliverable with Proof (Scene 5)
  await recordScene('scene5-submit-deliverable', 2000, async (page) => {
    await page.goto('https://trytroth.netlify.app/agreement/104', { waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForSelector('.space-y-3 > div', { state: 'visible', timeout: 15000 });

    // Inject submit button on Milestone 3 and modal handler
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.space-y-3 > div'));
      const m3Card = cards[2];
      if (m3Card) {
        const actionsDiv = m3Card.querySelector('.mt-4.flex');
        if (actionsDiv) {
          const btn = document.createElement('button');
          btn.id = 'demo-submit-m3-btn';
          btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors shadow-xs inline-flex items-center gap-1.5';
          btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Submit Deliverable';
          actionsDiv.appendChild(btn);

          // Build modal backdrop
          const modalHtml = `
            <div id="demo-modal-backdrop" style="position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);z-index:9999;display:none;align-items:center;justify-content:center;opacity:0;transition:opacity 0.25s ease;">
              <div id="demo-modal-box" style="background:#18181b;border:1px solid #27272a;border-radius:14px;width:100%;max-width:540px;padding:24px;color:#f4f4f5;box-shadow:0 20px 50px rgba(0,0,0,0.8);transform:scale(0.95);transition:transform 0.25s ease;">
                <div style="display:flex;align-items:center;justify-content:between;margin-bottom:8px;">
                  <h3 style="font-size:16px;font-weight:700;letter-spacing:-0.01em;">Submit Milestone Deliverable</h3>
                </div>
                <p style="font-size:12px;color:#a1a1aa;line-height:1.5;margin-bottom:18px;">
                  Provide a verifiable public URL to your deliverables (GitHub PR, preview link, or commit hash). Submitting activates the 7-day client review timer.
                </p>
                <div style="margin-bottom:18px;">
                  <label style="display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#d4d4d8;margin-bottom:6px;">Deliverable URL *</label>
                  <input id="demo-deliverable-input" type="url" placeholder="https://github.com/arc-ecosystem/troth/pull/42" style="width:100%;height:38px;padding:0 12px;border-radius:8px;background:#27272a;border:1px solid #3f3f46;color:#f4f4f5;font-family:monospace;font-size:12px;outline:none;box-sizing:border-box;" />
                </div>
                <div style="display:flex;align-items:center;justify-content:flex-end;gap:10px;">
                  <button id="demo-modal-cancel" type="button" style="padding:7px 14px;border-radius:8px;border:1px solid #3f3f46;background:transparent;color:#a1a1aa;font-size:12px;cursor:pointer;">Cancel</button>
                  <button id="demo-modal-submit" type="button" style="padding:7px 16px;border-radius:8px;border:none;background:#10b981;color:#ffffff;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    Submit for Review
                  </button>
                </div>
              </div>
            </div>
          `;
          document.body.insertAdjacentHTML('beforeend', modalHtml);

          const backdrop = document.getElementById('demo-modal-backdrop');
          const box = document.getElementById('demo-modal-box');
          const input = document.getElementById('demo-deliverable-input');
          const submitBtn = document.getElementById('demo-modal-submit');

          btn.addEventListener('click', () => {
            backdrop.style.display = 'flex';
            setTimeout(() => {
              backdrop.style.opacity = '1';
              box.style.transform = 'scale(1)';
              input.focus();
            }, 20);
          });

          submitBtn.addEventListener('click', () => {
            submitBtn.textContent = 'Submitting...';
            setTimeout(() => {
              backdrop.style.opacity = '0';
              box.style.transform = 'scale(0.95)';
              setTimeout(() => {
                backdrop.style.display = 'none';
                // Update Milestone 3 card
                btn.remove();
                // Status badge
                const m3Header = m3Card.querySelector('div:first-child');
                const badge = m3Card.querySelector('span:has-text("Pending"), div > span');
                if (badge) {
                  badge.textContent = 'Under Review';
                  badge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20';
                }
                // Proof bar
                const proofBar = document.createElement('div');
                proofBar.className = 'mt-3.5 pt-3.5 border-t border-[var(--border-default)] flex items-center justify-between text-xs';
                proofBar.innerHTML = `
                  <div class="flex items-center gap-1.5 text-zinc-400 truncate">
                    <span class="text-emerald-500">🛡️ Proof:</span>
                    <a href="${input.value || 'https://github.com/arc-ecosystem/troth/pull/42'}" class="font-mono text-emerald-400 underline truncate">${input.value || 'https://github.com/arc-ecosystem/troth/pull/42'}</a>
                  </div>
                  <div class="flex items-center gap-1 text-amber-500 font-mono text-[11px] shrink-0 ml-2">
                    <span>⏱️ 7d auto-release</span>
                  </div>
                `;
                m3Card.appendChild(proofBar);
              }, 250);
            }, 400);
          });
        }
      }
    });

    await page.waitForTimeout(800);

    // Scroll down to Milestone 3
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
    await page.waitForTimeout(1000);

    // Click "Submit Deliverable"
    const submitBtn = page.locator('#demo-submit-m3-btn');
    await clickCursor(page, submitBtn, { steps: 20 });
    await page.waitForTimeout(1000);

    // Type GitHub PR link into modal input
    const inputEl = page.locator('#demo-deliverable-input');
    await typeCursor(page, inputEl, 'https://github.com/arc-ecosystem/troth/pull/42');
    await page.waitForTimeout(800);

    // Click "Submit for Review"
    const modalSubmitBtn = page.locator('#demo-modal-submit');
    await clickCursor(page, modalSubmitBtn, { steps: 18 });
    await page.waitForTimeout(4000); // Hold on the updated Milestone 3 state
  });

  // TAKE 4: Mutual Safeguards & Sub-Second Payer Approval (Scene 6 & Scene 7)
  await recordScene('scene6-safeguards-and-approve', 2500, async (page) => {
    await page.goto('https://trytroth.netlify.app/agreement/104', { waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForTimeout(1000);

    // Scroll down to milestones
    await page.evaluate(() => window.scrollBy({ top: 320, behavior: 'smooth' }));
    await page.waitForTimeout(1200);

    // Hover over 5d auto-release clock and "Request Revision" button (Scene 6)
    const revisionBtn = page.locator('button:has-text("Request Revision")').first();
    const revBox = await revisionBtn.boundingBox();
    if (revBox) {
      await moveCursor(page, revBox.x + revBox.width / 2, revBox.y + revBox.height / 2, { steps: 22 });
      await page.waitForTimeout(2000);
    }

    // Move to and click "Approve & Release $10.00" (Scene 7)
    const approveReleaseBtn = page.locator('button:has-text("Approve & Release")').first();
    await clickCursor(page, approveReleaseBtn, { steps: 20 });
    await page.waitForTimeout(2500);

    // Scroll up slightly to reveal updated Escrow Balance ($20.00 Released)
    await page.evaluate(() => window.scrollBy({ top: -200, behavior: 'smooth' }));
    await page.waitForTimeout(3000);
  });

  console.log('\n🎉 All browser takes recorded successfully!');
}

runAll().catch(err => {
  console.error('Fatal error recording takes:', err);
  process.exit(1);
});
