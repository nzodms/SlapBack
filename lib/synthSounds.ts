// Procedural fallback sounds — used when MP3 files in /public/sounds/ are missing.
// Keeps SlapBack fully functional out of the box without any audio assets.

export type SynthProfile = (ctx: AudioContext, out: AudioNode) => number;

const noiseBuffer = (ctx: AudioContext, duration: number) => {
  const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
};

const quickScream: SynthProfile = (ctx, out) => {
  const dur = 0.4;
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(900, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(g).connect(out);
  osc.start();
  osc.stop(ctx.currentTime + dur);
  return dur;
};

const ouch: SynthProfile = (ctx, out) => {
  const dur = 0.28;
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(420, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(280, ctx.currentTime + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.3, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(g).connect(out);
  osc.start();
  osc.stop(ctx.currentTime + dur);
  return dur;
};

const cartoonHit: SynthProfile = (ctx, out) => {
  const dur = 0.18;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, dur);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 600;
  filter.Q.value = 5;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.5, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  src.connect(filter).connect(g).connect(out);
  src.start();
  return dur;
};

const slapImpact: SynthProfile = (ctx, out) => {
  const dur = 0.12;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, dur);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1800;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.65, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  src.connect(filter).connect(g).connect(out);
  src.start();
  return dur;
};

const demonVoice: SynthProfile = (ctx, out) => {
  const dur = 0.7;
  [80, 83, 161].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(g).connect(out);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  });
  return dur;
};

const calmDown: SynthProfile = (ctx, out) => {
  const dur = 0.5;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.25, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(g).connect(out);
  osc.start();
  osc.stop(ctx.currentTime + dur);
  return dur;
};

const clickAgain: SynthProfile = (ctx, out) => {
  const dur = 0.32;
  [0, 0.1, 0.21].forEach((delay) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 600 - delay * 100;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + delay + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.09);
    osc.connect(g).connect(out);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.11);
  });
  return dur;
};

const angryVoice: SynthProfile = (ctx, out) => {
  const dur = 0.45;
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(550, ctx.currentTime + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.28, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(g).connect(out);
  osc.start();
  osc.stop(ctx.currentTime + dur);
  return dur;
};

const dramaticScream: SynthProfile = (ctx, out) => {
  const dur = 0.9;
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(920, ctx.currentTime + 0.3);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + dur);
  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = 7;
  const vibratoGain = ctx.createGain();
  vibratoGain.gain.value = 32;
  vibrato.connect(vibratoGain).connect(osc.frequency);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(g).connect(out);
  osc.start();
  vibrato.start();
  osc.stop(ctx.currentTime + dur);
  vibrato.stop(ctx.currentTime + dur);
  return dur;
};

const panicScream: SynthProfile = (ctx, out) => {
  const dur = 0.65;
  [0, 0.12, 0.28, 0.44].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    const pitch = 500 + i * 180;
    osc.frequency.setValueAtTime(pitch, ctx.currentTime + delay);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, ctx.currentTime + delay + 0.1);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.25, ctx.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.12);
    osc.connect(g).connect(out);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.14);
  });
  return dur;
};

export const SYNTH_PROFILES: Record<string, SynthProfile> = {
  "quick-scream": quickScream,
  ouch,
  "cartoon-hit": cartoonHit,
  "slap-impact": slapImpact,
  "demon-voice": demonVoice,
  "calm-down": calmDown,
  "click-again": clickAgain,
  "angry-voice": angryVoice,
  "dramatic-scream": dramaticScream,
  "panic-scream": panicScream,
};

export function playSynth(id: string, muted: boolean): void {
  if (muted) return;
  const profile = SYNTH_PROFILES[id];
  if (!profile) return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(ctx.destination);
    const dur = profile(ctx, master);
    setTimeout(() => ctx.close().catch(() => {}), (dur + 0.3) * 1000);
  } catch {
    // ignore
  }
}
