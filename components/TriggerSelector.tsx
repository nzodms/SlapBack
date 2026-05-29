"use client";
import { TRIGGERS, TriggerType } from "@/lib/triggers";

interface Props {
  selected: TriggerType;
  onSelect: (id: TriggerType) => void;
  customKey: string | null;
  onCaptureKey: () => void;
  isCapturing: boolean;
}

export default function TriggerSelector({
  selected,
  onSelect,
  customKey,
  onCaptureKey,
  isCapturing,
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
        02 — Déclencheur
      </h2>
      <div className="space-y-1.5">
        {TRIGGERS.map((trigger) => (
          <button
            key={trigger.id}
            onClick={() => onSelect(trigger.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
              selected === trigger.id
                ? "bg-yellow-400/10 border-yellow-400/60 text-yellow-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
            }`}
          >
            <span className="text-lg leading-none">{trigger.emoji}</span>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight">{trigger.label}</div>
              <div className="text-xs text-zinc-600 mt-0.5 truncate">{trigger.description}</div>
            </div>
          </button>
        ))}
      </div>

      {selected === "custom-key" && (
        <button
          onClick={onCaptureKey}
          className={`w-full py-2.5 rounded-xl border text-sm font-semibold transition-all ${
            isCapturing
              ? "border-yellow-400 bg-yellow-400/10 text-yellow-300 animate-pulse"
              : "border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-white"
          }`}
        >
          {isCapturing
            ? "⌨️ Appuie sur une touche..."
            : customKey
            ? `Touche : "${customKey}" — Changer`
            : "Choisir une touche"}
        </button>
      )}
    </div>
  );
}
