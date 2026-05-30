"use client";

import { useState } from "react";
import Link from "next/link";
import { DOWNLOAD_READY, DOWNLOAD_URL } from "@/lib/download";
import BetaModal from "@/components/BetaModal";

interface Props {
  // "hero" = big primary button, "ghost" = secondary outline
  variant?: "hero" | "ghost";
  // show the secondary "View install guide" link next to it
  withGuideLink?: boolean;
  className?: string;
}

export default function DownloadButton({
  variant = "hero",
  withGuideLink = true,
  className = "",
}: Props) {
  const [showBeta, setShowBeta] = useState(false);

  const label = DOWNLOAD_READY ? "Download for Mac" : "Join Mac beta";

  const handleClick = () => {
    if (DOWNLOAD_READY) {
      // Trigger the real .dmg download…
      const a = document.createElement("a");
      a.href = DOWNLOAD_URL;
      a.download = "SlapBack.dmg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      // …then send them to the install guide.
      setTimeout(() => {
        window.location.href = "/install";
      }, 600);
    } else {
      setShowBeta(true);
    }
  };

  const base =
    "inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95";
  const styles =
    variant === "hero"
      ? "bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/30"
      : "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white";

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-3 ${className}`}>
      <button onClick={handleClick} className={`${base} ${styles}`}>
        <span className="text-base"></span>
        {label}
      </button>

      {withGuideLink && (
        <Link
          href="/install"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-zinc-800 text-zinc-400 font-semibold text-sm hover:border-zinc-600 hover:text-white transition-all active:scale-95"
        >
          View install guide
        </Link>
      )}

      <BetaModal open={showBeta} onClose={() => setShowBeta(false)} />
    </div>
  );
}
