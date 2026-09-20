import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const audioDir = path.resolve("videos/troth-showcase/audio");
const bgmPath = path.join(audioDir, "bgm-tech.mp3");

// 1. Build the assembled voiceover track with precise adelay
console.log("=== Assembling Voiceover Track with Frame-Accurate Delays ===");

const beats = [
  { file: path.join(audioDir, "beat-1-intro.mp3"), delayMs: 200 },       // 0.2s
  { file: path.join(audioDir, "beat-2-simulator.mp3"), delayMs: 4000 },   // 4.0s
  { file: path.join(audioDir, "beat-3-create.mp3"), delayMs: 19000 },     // 19.0s
  { file: path.join(audioDir, "beat-4-approve.mp3"), delayMs: 43000 },    // 43.0s
  { file: path.join(audioDir, "beat-5-terminal.mp3"), delayMs: 58500 },   // 58.5s
  { file: path.join(audioDir, "beat-6-outro.mp3"), delayMs: 65500 }       // 65.5s
];

// Verify all files exist
for (const b of beats) {
  if (!fs.existsSync(b.file)) {
    throw new Error(`Missing audio file: ${b.file}`);
  }
}

// Construct ffmpeg inputs and filter graph for voiceover
const inputArgs = beats.flatMap((b) => ["-i", b.file]);
const delayFilters = beats
  .map((b, i) => `[${i}:a]adelay=${b.delayMs}|${b.delayMs}[a${i}]`)
  .join(";");
const mixInputs = beats.map((_, i) => `[a${i}]`).join("");
const voFilter = `${delayFilters};${mixInputs}amix=inputs=${beats.length}:dropout_transition=0:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=10[vo]`;

const voTrackPath = path.join(audioDir, "vo-full.wav");
const cmdVO = `ffmpeg -y ${inputArgs.join(" ")} -filter_complex "${voFilter}" -map "[vo]" -t 69 "${voTrackPath}"`;
console.log("Running ffmpeg VO assembly...");
execSync(cmdVO, { stdio: "inherit" });

// 2. Mix VO with BGM using sidechain ducking + fade in/out
console.log("\n=== Mixing Voiceover and BGM with Sidechain Ducking ===");
const mixedTrackPath = path.join(audioDir, "troth-demo-audio.mp3");

// Filter graph:
// [0:a] is VO (69s)
// [1:a] is BGM (trimmed to 69s, with afade in at start and afade out at end)
// BGM is ducked via sidechaincompress keyed to [0:a] so voice cuts through crisply.
const mixFilter = `
[1:a]atrim=0:69,asetpts=PTS-STARTPTS,afade=t=in:ss=0:d=1.5,afade=t=out:st=66:d=3,volume=0.18[bgm];
[bgm][0:a]sidechaincompress=threshold=0.03:ratio=4:attack=50:release=350[ducked_bgm];
[0:a][ducked_bgm]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[out]
`.replace(/\n/g, "");

const cmdMix = `ffmpeg -y -i "${voTrackPath}" -i "${bgmPath}" -filter_complex "${mixFilter}" -map "[out]" -b:a 256k -t 69 "${mixedTrackPath}"`;
console.log("Running ffmpeg BGM + VO mix...");
execSync(cmdMix, { stdio: "inherit" });

console.log(`\n=== Master audio successfully generated at: ${mixedTrackPath} ===`);
