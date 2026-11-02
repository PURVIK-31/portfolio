import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import styles from "./TerminalIntro.module.scss";

type Props = {
  name: string;
  role: string;
  status: string;
  latest?: { title: ReactNode; href: string };
};

/** Typed command: width animates from 0 to N characters (pure CSS, no JS). */
function Cmd({ text, delay }: { text: string; delay: number }) {
  return (
    <span
      className={styles.cmd}
      style={{ "--chars": text.length, "--delay": `${delay}s` } as CSSProperties}
    >
      {text}
    </span>
  );
}

/**
 * Hero intro as a tiny terminal session. All text is server-rendered (crawlers and
 * screen readers get it immediately); the typing/fade effect is CSS only and is
 * switched off for prefers-reduced-motion.
 */
export function TerminalIntro({ name, role, status, latest }: Props) {
  return (
    <div className={styles.terminal}>
      <div className={styles.titleBar}>
        <span className={styles.lights} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.title} aria-hidden="true">
          purvik@jaipur: ~
        </span>
        <span className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />
          {status}
        </span>
      </div>

      <div className={styles.body}>
        <p className={styles.line}>
          <span className={styles.prompt} aria-hidden="true">
            ❯
          </span>
          <Cmd text="whoami" delay={0.3} />
        </p>
        <p className={`${styles.line} ${styles.output}`} style={{ "--delay": "0.95s" } as CSSProperties}>
          <strong className={styles.name}>{name}</strong>
          <span className={styles.dim}> — </span>
          {role}
        </p>

        {latest && (
          <>
            <p className={styles.line}>
              <span className={styles.prompt} aria-hidden="true">
                ❯
              </span>
              <Cmd text="git log -1 --oneline" delay={1.35} />
            </p>
            <p className={`${styles.line} ${styles.output}`} style={{ "--delay": "2.35s" } as CSSProperties}>
              <span className={styles.hash} aria-hidden="true">
                a1f3c9e{" "}
              </span>
              <Link href={latest.href} className={styles.commit}>
                <span className={styles.feat}>feat:</span> {latest.title}
                <span className={styles.commitArrow} aria-hidden="true">
                  →
                </span>
              </Link>
              <span className={styles.caret} aria-hidden="true" />
            </p>
          </>
        )}
      </div>
    </div>
  );
}
