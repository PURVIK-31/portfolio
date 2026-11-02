"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/once-ui/components/ThemeProvider";
import styles from "./HeroVisual.module.scss";

// three.js is only downloaded in the browser, after the page's own content
const CoreScene = dynamic(() => import("./CoreScene"), { ssr: false, loading: () => null });

const CHIPS = [
  { label: "Next.js", className: styles.chip1 },
  { label: "Node.js", className: styles.chip2 },
  { label: "WebSockets", className: styles.chip3 },
  { label: "Python", className: styles.chip4 },
  { label: "Rust", className: styles.chip5 },
];

export function HeroVisual() {
  const { resolvedTheme } = useTheme();

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.glow} />
      <CoreScene theme={resolvedTheme} />
      {CHIPS.map((chip, i) => (
        <span key={chip.label} className={`${styles.chip} ${chip.className}`} style={{ animationDelay: `${i * -1.3}s` }}>
          <span className={styles.chipDot} />
          {chip.label}
        </span>
      ))}
    </div>
  );
}
