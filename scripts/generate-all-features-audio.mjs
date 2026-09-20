import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const API_KEY = "sk_sp9oujj3tncjcu3unzsfygj0p24we8yj674i52pdtfhtbexs";
const VOICE_ID = "minimax_273587280617670";
const SPEED = "1.0";

const outputDir = path.resolve("videos/troth-showcase/audio");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const beats = [
  {
    id: "beat-1-intro",
    name: "Intro",
    text: "Meet Troth: trustless milestone escrow on Arc.",
    targetStartMs: 200, // 0.2s
  },
  {
    id: "beat-2-simulator",
    name: "Scene 1: Simulator & Rake",
    text: "Traditional freelance platforms extract up to twenty percent in fees. Troth takes zero. Built on Arc Layer One, payments settle in three hundred fifty milliseconds with native USDC gas.",
    targetStartMs: 3500, // 3.5s
  },
  {
    id: "beat-3-create",
    name: "Scene 2: Creation Wizard",
    text: "Creating an agreement takes seconds. Partition deliverables into verifiable tranches, set delivery deadlines, and lock funds upfront without needing the contractor's address.",
    targetStartMs: 18500, // 18.5s
  },
  {
    id: "beat-4-invite-copy",
    name: "Scene 3: Invite Link & Copy",
    text: "Troth generates a secret cryptographic invite link. You can send this privately over Telegram, Discord, or email to anyone in the world.",
    targetStartMs: 34500, // 34.5s
  },
  {
    id: "beat-5-contractor-claim",
    name: "Scene 4: Contractor Claim",
    text: "When the contractor opens the link, the smart contract binds their wallet address directly to the agreement with a single click.",
    targetStartMs: 44500, // 44.5s
  },
  {
    id: "beat-6-submit-proof",
    name: "Scene 5: Submit Deliverable Proof",
    text: "Once work is complete, the contractor submits verifiable proof—a GitHub pull request, commit hash, or IPFS link—starting the review countdown.",
    targetStartMs: 56500, // 56.5s
  },
  {
    id: "beat-7-mutual-safeguards",
    name: "Scene 6: Mutual Safeguards & Revision",
    text: "Both parties are shielded by mutual safeguards: payers can request revisions if criteria are missed, while auto-release clocks protect contractors if a client goes silent.",
    targetStartMs: 70500, // 70.5s
  },
  {
    id: "beat-8-instant-settle",
    name: "Scene 7: Instant Settlement",
    text: "With one click, the payer approves the deliverable. Funds release into the contractor's wallet in under a second—no waiting days for platform clearance.",
    targetStartMs: 84500, // 84.5s
  },
  {
    id: "beat-9-terminal-tests",
    name: "Scene 8: Contract Integrity & Foundry",
    text: "Backed by audited Solidity contracts, with eleven out of eleven Foundry tests verifying automated timeout refunds and reentrancy protection on live Arc Mainnet.",
    targetStartMs: 98500, // 98.5s
  },
  {
    id: "beat-10-outro",
    name: "Outro",
    text: "Try Troth today, live on Arc Mainnet.",
    targetStartMs: 109200, // 109.2s
  }
];

async function generateBeat(beat) {
  const destPath = path.join(outputDir, `${beat.id}.mp3`);
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    console.log(`⏩ [${beat.id}] already exists (${fs.statSync(destPath).size} bytes), skipping generation.`);
    return { ...beat, audioPath: destPath };
  }

  console.log(`\n🎙️  Generating [${beat.id}]: "${beat.text}"`);
  const form = new FormData();
  form.append("text", beat.text);
  form.append("voice_id", VOICE_ID);
  form.append("speed", SPEED);

  const initRes = await fetch("https://api.ai33.pro/v3/text-to-speech", {
    method: "POST",
    headers: { "xi-api-key": API_KEY },
    body: form
  });

  const initData = await initRes.json();
  if (!initData.task_id) {
    throw new Error(`Failed to initialize task for ${beat.id}: ${JSON.stringify(initData)}`);
  }

  const taskId = initData.task_id;
  console.log(`Task ID: ${taskId}. Polling for completion...`);

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(`https://api.ai33.pro/v1/task/${taskId}`, {
      headers: { "xi-api-key": API_KEY }
    });
    const pollData = await pollRes.json();

    if (pollData.status === "done") {
      const audioUrl = pollData.metadata?.audio_url;
      console.log(`Done! Downloading from CDN: ${audioUrl}`);

      const audioRes = await fetch(audioUrl);
      const buffer = Buffer.from(await audioRes.arrayBuffer());
      fs.writeFileSync(destPath, buffer);
      console.log(`✅ Saved ${buffer.length} bytes to ${destPath}`);
      return { ...beat, audioPath: destPath };
    }

    if (pollData.status === "error") {
      throw new Error(`TTS generation error for ${beat.id}: ${JSON.stringify(pollData)}`);
    }
  }

  throw new Error(`Timeout waiting for task ${taskId}`);
}

async function main() {
  console.log("=================================================");
  console.log("🚀 Generating 10 VO Beats for 114s Master Cut...");
  console.log("=================================================");

  const results = [];
  for (const beat of beats) {
    const res = await generateBeat(beat);
    results.push(res);
  }

  // Save manifest
  const manifestPath = path.join(outputDir, "manifest-114s.json");
  fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Manifest saved to: ${manifestPath}`);

  // Assemble full VO track with adelay
  console.log("\n=== Assembling 114s Full VO Track ===");
  const inputArgs = results.flatMap((b) => ["-i", b.audioPath]);
  const delayFilters = results
    .map((b, i) => `[${i}:a]adelay=${b.targetStartMs}|${b.targetStartMs}[a${i}]`)
    .join(";");
  const mixInputs = results.map((_, i) => `[a${i}]`).join("");
  const voFilter = `${delayFilters};${mixInputs}amix=inputs=${results.length}:dropout_transition=0:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=10[vo]`;

  const voTrackPath = path.join(outputDir, "vo-114s-full.wav");
  const cmdVO = `ffmpeg -y ${inputArgs.join(" ")} -filter_complex "${voFilter}" -map "[vo]" -t 114 "${voTrackPath}"`;
  console.log("Running ffmpeg VO assembly...");
  execSync(cmdVO, { stdio: "inherit" });

  // Mix with BGM using sidechain ducking
  console.log("\n=== Mixing Voiceover and BGM with Sidechain Ducking ===");
  const bgmPath = path.join(outputDir, "bgm-tech.mp3");
  const mixedTrackPath = path.join(outputDir, "troth-all-features-audio.mp3");

  const mixFilter = `
  [1:a]atrim=0:114,asetpts=PTS-STARTPTS,afade=t=in:ss=0:d=1.5,afade=t=out:st=110.5:d=3.5,volume=0.18[bgm];
  [bgm][0:a]sidechaincompress=threshold=0.03:ratio=4:attack=50:release=350[ducked_bgm];
  [0:a][ducked_bgm]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[out]
  `.replace(/\n/g, "");

  const cmdMix = `ffmpeg -y -i "${voTrackPath}" -i "${bgmPath}" -filter_complex "${mixFilter}" -map "[out]" -b:a 256k -t 114 "${mixedTrackPath}"`;
  console.log("Running ffmpeg BGM + VO mix...");
  execSync(cmdMix, { stdio: "inherit" });

  console.log(`\n🎉 Master audio successfully mixed at: ${mixedTrackPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
