"use client";
import { SOUNDS } from "@/lib/sounds";

interface Props {
  selected: string;
  onSelect: (id: string) => void;
  onPreview: () => void;
  hasError: boolean;
}

export default function SoundSelector({ selected, onSelect, onPreview, hasError }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
        01 — Son
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {SOUNDS.map((sound) => (
          <button
            key={sound.id}
            onClick={() => onSelect(sound.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all duration-150 ${
              selected === sound.id
                ? "bg-red-500/20 border-red-500 text-white"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
            }`}
          >
            <span className="text-base leading-none">{sound.emoji}</span>
            <span className="text-xs font-medium truncate">{sound.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onPreview}
        className="w-full py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-all text-sm font-semibold"
      >
        ▶ Preview Sound
      </button>
      {hasError && (
        <p className="text-xs text-red-400 text-center">
          Son introuvable. Ajoute les fichiers dans <code>/public/sounds/</code>.
        </p>
      )}
    </div>
  );
}
