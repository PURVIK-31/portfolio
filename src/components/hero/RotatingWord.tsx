"use client";

import { useEffect, useState } from "react";
import styles from "./RotatingWord.module.scss";

/**
 * Cycles through words in place. The server renders only the first word, so crawlers
 * read a clean sentence ("I build real-time web apps…"). After mount, all words share
 * one grid cell so the width never jumps. Reduced-motion users keep the first word.
 */
export function RotatingWord({ words, interval = 2600 }: { words: string[]; interval?: number }) {
  const [animated, setAnimated] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAnimated(true);
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  if (!animated) {
    return (
      <span className={styles.stack}>
        <span className={`${styles.word} ${styles.active}`}>{words[0]}</span>
      </span>
    );
  }

  return (
    <span className={styles.wrapper}>
      <span className={styles.srOnly}>{words[0]}</span>
      <span className={styles.stack} aria-hidden="true">
        {words.map((word, i) => (
          <span key={word} className={`${styles.word} ${i === index ? styles.active : ""}`}>
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}
