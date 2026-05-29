// Procedural fallback sounds — used when MP3 files in /public/sounds/ are missing.
// Keeps SlapBack fully functional out of the box.

export type SynthProfile = (ctx: AudioContext, out: AudioNode) => number;

const noiseBuffer = (ctx: AudioContext, duration: number) => {
  const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
};

const scream: SynthProfile = (ctx, out) => {
  const dur = 0.45;
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
  const dur = 0.25;
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

const slap: SynthProfile = (ctx, out) => {
  const dur = 0.12;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, dur);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1800;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.6, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  src.connect(filter).connect(g).connect(out);
  src.start();
  return dur;
};

const alarm: SynthProfile = (ctx, out) => {
  const dur = 0.6;
  const osc = ctx.createOscillator();
  osc.type = "square";
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 8;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 200;
  osc.frequency.value = 800;
  lfo.connect(lfoGain).connect(osc.frequency);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.25, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(g).connect(out);
  osc.start();
  lfo.start();
  osc.stop(ctx.currentTime + dur);
  lfo.stop(ctx.currentTime + dur);
  return dur;
};

const demon: SynthProfile = (ctx, out) => {
  const dur = 0.7;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type = "sawtooth";
  osc2.type = "sawtooth";
  osc1.frequency.value = 80;
  osc2.frequency.value = 83;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc1.connect(g);
  osc2.connect(g);
  g.connect(out);
  osc1.start();
  osc2.start();
  osc1.stop(ctx.currentTime + dur);
  osc2.stop(ctx.currentTime + dur);
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
  const dur = 0.3;
  [0, 0.1, 0.2].forEach((delay) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 600;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + delay + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.08);
    osc.connect(g).connect(out);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.1);
  });
  return dur;
};

const whyScreaming: SynthProfile = (ctx, out) => {
  const dur = 0.4;
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(550, ctx.currentTime + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.25, ctx.currentTime);
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
  osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.3);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + dur);
  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = 7;
  const vibratoGain = ctx.createGain();
  vibratoGain.gain.value = 30;
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

export const SYNTH_PROFILES: Record<string, SynthProfile> = {
  "scream-short": scream,
  ouch,
  "cartoon-hit": cartoonHit,
  slap,
  alarm,
  demon,
  "calm-down": calmDown,
  "click-again": clickAgain,
  "why-screaming": whyScreaming,
  "dramatic-scream": dramaticScream,
};

export function playSynth(id: string, muted: boolean): void {
  if (muted) return;
  const profile = SYNTH_PROFILES[id];
  if (!profile) return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(ctx.destination);
    const dur = profile(ctx, master);
    setTimeout(() => ctx.close().catch(() => {}), (dur + 0.2) * 1000);
  } catch {
    // ignore
  }
}
