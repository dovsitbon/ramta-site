"use client";

import { useEffect, useState } from "react";

const KEY = "ramta-intro";

/**
 * Ouverture (1,5 s max, une fois par session) : fond crème, les collines se dessinent au trait,
 * le soleil descend derrière, « רַמְתָּא » puis « RAMTA » apparaissent, une braise s'allume, fondu sur le hero.
 * Masquée d'office (script dans <head>) si déjà vue ou si l'utilisateur réduit les animations ; tout est en CSS.
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("intro-seen")) {
      setGone(true);
      return;
    }
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    const t = setTimeout(() => {
      html.classList.add("intro-seen");
      setGone(true);
    }, 1550);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  const skip = () => {
    document.documentElement.classList.add("intro-seen");
    setGone(true);
  };

  return (
    <div className="intro">
      <div className="intro-stage" aria-hidden="true">
        <svg viewBox="0 0 240 110" className="intro-svg" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <clipPath id="intro-sky">
              <path d="M0 0H240V66C216 50 192 44 166 52C148 58 134 58 116 48C86 32 50 34 0 58Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#intro-sky)">
            <circle className="intro-sun" cx="132" cy="40" r="15" fill="var(--color-sun)" />
          </g>
          <path className="intro-hill intro-hill-back" d="M0 58c50-24 86-26 116-10 18 10 32 10 50 4 26-8 50-2 74 14" stroke="var(--color-earth)" strokeWidth="1.6" />
          <path className="intro-hill intro-hill-front" d="M0 92c40-22 90-30 140-26 38 3 70 12 100 22" stroke="var(--color-olive)" strokeWidth="1.6" />
          <circle className="intro-ember" cx="212" cy="96" r="2.6" fill="var(--color-ember)" />
        </svg>
        <p className="intro-word" lang="he">
          רַמְתָּא
        </p>
        <p className="intro-latin" lang="en">
          RAMTA
        </p>
      </div>
      <button type="button" onClick={skip} className="intro-skip">
        {skipLabel}
      </button>
    </div>
  );
}
