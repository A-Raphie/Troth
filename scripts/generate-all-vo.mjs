import fs from "fs";
import path from "path";

const API_KEY = "sk_sp9oujj3tncjcu3unzsfygj0p24we8yj674i52pdtfhtbexs";
const VOICE_ID = "minimax_273587280617670";
const SPEED = "1.0";

const beats = [
  {
    id: "beat-1-intro",
    name: "Intro",
    text: "Meet Troth: trustless milestone escrow on Arc.",
    targetStart: 0.2
  },
  {
    id: "beat-2-simulator",
    name: "Scene 1: Simulator & Rake",
    text: "Most freelance platforms take ten to twenty percent. Troth takes zero. Powered by Arc Layer One, payments settle in three hundred fifty milliseconds with sub-cent native USDC gas.",
    targetStart: 3.5
  },
  {
    id: "beat-3-create",
    name: "Scene 2: Creation Wizard",
    text: "Creating an escrow takes seconds. Break work into verifiable tranches, set review windows and delivery deadlines, and lock funds upfront. Then share a private cryptographic invite link directly with your contractor.",
    targetStart: 18.5
  },
  {
    id: "beat-4-approve",
    name: "Scene 3: Approval & Settlement",
    text: "When deliverables are submitted, review proof and approve with one click. Funds release instantly to the contractor's wallet, with dual anti-ghosting timers protecting both sides.",
    targetStart: 42.5
  },
  {
    id: "beat-5-terminal",
    name: "Scene 4: Contract Integrity",
    text: "Backed by audited Solidity contracts, with eleven out of eleven Foundry tests passing.",
    targetStart: 58.5
  },
  {
    id: "beat-6-outro",
    name: "Outro",
    text: "Try Troth today, live on Arc Mainnet.",
    targetStart: 65.2
  }
];

const outputDir = path.resolve("videos/troth-showcase/audio");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateBeat(beat) {
  console.log(`\nGenerating [${beat.id}]: "${beat.text}"`);
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
      const destPath = path.join(outputDir, `${beat.id}.mp3`);
      fs.writeFileSync(destPath, buffer);
      console.log(`Saved ${buffer.length} bytes to ${destPath}`);
      return { ...beat, audioPath: destPath };
    }

    if (pollData.status === "error") {
      throw new Error(`TTS generation error for ${beat.id}: ${JSON.stringify(pollData)}`);
    }
  }

  throw new Error(`Timeout waiting for task ${taskId}`);
}

async function main() {
  console.log("=== Generating All Voiceover Beats with ai33.pro (Honest Man voice) ===");
  const results = [];
  for (const beat of beats) {
    const res = await generateBeat(beat);
    results.push(res);
  }

  fs.writeFileSync(
    path.join(outputDir, "manifest.json"),
    JSON.stringify(results, null, 2)
  );
  console.log("\n=== All beats successfully generated and saved! ===");
}

main().catch((err) => {
  console.error("Error generating voiceover:", err);
  process.exit(1);
});
