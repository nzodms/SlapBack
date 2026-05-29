"use client";
import { TRIGGERS, TriggerType } from "@/lib/triggers";
import { motion } from "framer-motion";

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
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-black flex items-center justify-center">
          2
        </div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">
          Pick trigger
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {TRIGGERS.map((trigger) => {
          const isSelected = selected === trigger.id;
          return (
            <motion.button
              key={trigger.id}
              onClick={() => onSelect(trigger.id)}
              whileTap={{ scale: 0.98 }}
              className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all duration-150 ${
                isSelected
                  ? "bg-yellow-400/10 border-yellow-400/60 text-white"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
              }`}
            >
              <span className="text-lg leading-none flex-shrink-0">{trigger.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold leading-tight">{trigger.label}</div>
                <div className="text-[11px] text-zinc-600 mt-0.5 truncate group-hover:text-zinc-500">
                  {trigger.description}
                </div>
              </div>
              {isSelected && <span className="text-yellow-400 text-sm">●</span>}
            </motion.button>
          );
        })}
      </div>

      {selected === "custom-key" && (
        <button
          onClick={onCaptureKey}
          className={`w-full py-2.5 rounded-xl border text-sm font-bold transition-all ${
            isCapturing
              ? "border-yellow-400 bg-yellow-400/10 text-yellow-300 animate-pulse"
              : "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
          }`}
        >
          {isCapturing
            ? "⌨️ Press any key now..."
            : customKey
            ? `Key: “${customKey}” — change`
            : "Choose a key"}
        </button>
      )}

      <p className="text-[11px] text-zinc-600 leading-relaxed">
        Keyboard and mouse triggers work while this app window is focused.
      </p>
    </div>
  );
}
