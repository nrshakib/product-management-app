"use client";

import { useState, useEffect } from "react";

export default function Typewriter({
  texts = [],
  speed = 100,
  pause = 1500,
  loop = true,
  className,
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!texts.length) return;

    const interval = setInterval(() => {
      const currentText = texts[textIndex];
      if (charIndex < currentText.length) {
        setDisplayedText((prev) => prev + currentText[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        // Finished typing current text
        clearInterval(interval);
        setTimeout(() => {
          if (loop) {
            setDisplayedText("");
            setCharIndex(0);
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
        }, pause);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [charIndex, textIndex, texts, speed, pause, loop]);

  return (
    <h1 className={className}>
      {displayedText}
      <span className="border-r-2 border-blue-500 animate-[blink_1s_steps(1)_infinite] ml-1"></span>
    </h1>
  );
}
