import { useState, useEffect } from "react";
import { detectSizeMode, type SizeMode } from "./constants";

// ─── SIZE MODE HOOK ───────────────────────────────────────
// "Is this a small screen?" — drives how big things are drawn (touch targets,
// type, width). Separate from useLayoutMode, which drives fixed-vs-scroll.
//
// Every screen reads this and pulls its sizing from SIZE[mode], so the whole
// app shares one comfortable-mobile / refined-desktop scale and stays
// consistent as new screens are added.
export function useSizeMode(): SizeMode {
  const [mode, setMode] = useState<SizeMode>(() => detectSizeMode());

  useEffect(() => {
    const onResize = () => setMode(detectSizeMode());
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return mode;
}
