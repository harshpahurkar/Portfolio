// Lightweight Web Audio API sound system — no dependencies needed.
// All sounds are synthesized programmatically.

type SoundType = "type" | "hover" | "click" | "glitch" | "success" | "whoosh";

let audioCtx: AudioContext | null = null;
let _enabled = false;

function ctx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

// Short typing blip
function synthType() {
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.value = 800 + Math.random() * 600;
  osc.type = "square";
  gain.gain.setValueAtTime(0.04, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  osc.start(t);
  osc.stop(t + 0.06);
}

// Soft hover blip
function synthHover() {
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.value = 2200;
  osc.type = "sine";
  gain.gain.setValueAtTime(0.025, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  osc.start(t);
  osc.stop(t + 0.05);
}

// Percussive click
function synthClick() {
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(600, t);
  osc.frequency.exponentialRampToValueAtTime(150, t + 0.1);
  osc.type = "square";
  gain.gain.setValueAtTime(0.06, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.start(t);
  osc.stop(t + 0.1);
}

// Short digital noise burst
function synthGlitch() {
  const c = ctx();
  const t = c.currentTime;
  const bufferSize = Math.floor(c.sampleRate * 0.08);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const gain = c.createGain();
  source.connect(gain);
  gain.connect(c.destination);
  gain.gain.setValueAtTime(0.05, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  source.start(t);
}

// Ascending arpeggio — victory/success sound
function synthSuccess() {
  const c = ctx();
  const t = c.currentTime;
  [523, 659, 784].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    const start = t + i * 0.1;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.04, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
    osc.start(start);
    osc.stop(start + 0.3);
  });
}

// Quick frequency sweep
function synthWhoosh() {
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(2000, t + 0.12);
  osc.type = "sine";
  gain.gain.setValueAtTime(0.03, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc.start(t);
  osc.stop(t + 0.15);
}

const synths: Record<SoundType, () => void> = {
  type: synthType,
  hover: synthHover,
  click: synthClick,
  glitch: synthGlitch,
  success: synthSuccess,
  whoosh: synthWhoosh,
};

export function isAudioEnabled(): boolean {
  return _enabled;
}

export function setAudioEnabled(val: boolean): void {
  _enabled = val;
  if (val) ctx(); // Create context on enable (needs user gesture)
}

export function toggleAudio(): boolean {
  setAudioEnabled(!_enabled);
  return _enabled;
}

export function playSound(type: SoundType): void {
  if (!_enabled) return;
  try {
    synths[type]();
  } catch {
    // Audio may not be available in some environments
  }
}
