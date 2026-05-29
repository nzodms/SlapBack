"use client";
import { SOUNDS } from "@/lib/sounds";
import { motion } from "framer-motion";

interface Props {
  selected: string;
  onSelect: (id: string) => void;
  onPreview: () => void;
  usingFallback: boolean;
}

export default function SoundSelector({ selected, onSelect, onPreview, usingFallback }: Props) {
  const current = SOUNDS.find((s) => s.id === selected);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">
            1
          </div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">
            Choose sound
          </h2>
        </div>
        <button
          onClick={onPreview}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-300 hover:border-white hover:text-white text-xs font-bold transition-all"
        >
          ▶ Preview
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
        {SOUNDS.map((sound) => {
          const isSelected = selected === sound.id;
          return (
            <motion.button
              key={sound.id}
              onClick={() => onSelect(sound.id)}
              whileTap={{ scale: 0.96 }}
              className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-150 ${
                isSelected
                  ? "bg-red-500/10 border-red-500/70 text-white"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
              }`}
            >
              <span className="text-lg leading-none flex-shrink-0">{sound.emoji}</span>
              <span className="text-xs font-semibold truncate">{sound.label}</span>
              {isSelected && (
                <motion.span
                  layoutId="sound-marker"
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {current && (
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50 text-xs">
          <span className="text-zinc-500">
            Selected: <span className="text-white font-bold">{current.label}</span>
          </span>
          {usingFallback && (
            <span className="text-yellow-500/80" title="MP3 file missing, using fallback synth">
              ⚠ Synth fallback
            </span>
          )}
        </div>
      )}
    </div>
  );
}
