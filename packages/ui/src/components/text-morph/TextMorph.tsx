'use client';

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import './TextMorph.css';

export interface TextMorphProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The current text. When this prop changes, the component diff-types
      from the previously displayed text to the new value. */
  value: string;
  /** Optional renderer for the current intermediate text — handy for
      syntax highlighting, gradient spans, or wrapping each word. Receives
      the partial string at every keystroke during the animation. */
  renderText?: (current: string) => ReactNode;
  /** Per-character typing delay range in ms. Default [30, 60]. */
  typeDelay?: [min: number, max: number];
  /** Per-character backspace delay range in ms. Default [18, 30]. */
  backspaceDelay?: [min: number, max: number];
  /** Characters that get an additional delay (harder to type on a real
      keyboard — punctuation, brackets, symbols). Default /[\/{}\-_@]/. */
  hardChars?: RegExp;
  /** Extra delay range for hard chars in ms. Default [30, 65]. */
  hardCharExtraDelay?: [min: number, max: number];
  /** Pause between backspace phase and typing phase, in ms. Default 70. */
  pauseMs?: number;
  /** Skip animation entirely and just swap text. */
  disabled?: boolean;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function findDiff(from: string, to: string) {
  let p = 0;
  const maxP = Math.min(from.length, to.length);
  while (p < maxP && from[p] === to[p]) p++;
  let s = 0;
  while (
    s < from.length - p &&
    s < to.length - p &&
    from[from.length - 1 - s] === to[to.length - 1 - s]
  ) {
    s++;
  }
  return {
    prefix: from.slice(0, p),
    suffix: from.slice(from.length - s),
    oldMid: from.slice(p, from.length - s),
    newMid: to.slice(p, to.length - s),
  };
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export const TextMorph = forwardRef<HTMLSpanElement, TextMorphProps>(
  function TextMorph(
    {
      value,
      renderText,
      typeDelay = [30, 60],
      backspaceDelay = [18, 30],
      hardChars = /[\/{}\-_@]/,
      hardCharExtraDelay = [30, 65],
      pauseMs = 70,
      disabled = false,
      className = '',
      ...rest
    },
    ref,
  ) {
    const [displayed, setDisplayed] = useState(value);
    const tokenRef = useRef(0);
    const reducedRef = useRef(false);
    const prevValueRef = useRef(value);
    const displayedRef = useRef(value);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        reducedRef.current = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches;
      }
    }, []);

    // Keep a ref of the currently shown text so the animation always
    // starts from the latest frame (even if interrupted mid-typing).
    useEffect(() => {
      displayedRef.current = displayed;
    }, [displayed]);

    useEffect(() => {
      if (value === prevValueRef.current) return;
      const source = displayedRef.current;
      prevValueRef.current = value;

      if (disabled || reducedRef.current) {
        setDisplayed(value);
        return;
      }

      const myToken = ++tokenRef.current;

      (async () => {
        const { prefix, suffix, oldMid, newMid } = findDiff(source, value);

        for (let i = oldMid.length - 1; i >= 0; i--) {
          if (myToken !== tokenRef.current) return;
          setDisplayed(prefix + oldMid.slice(0, i) + suffix);
          await sleep(rand(backspaceDelay[0], backspaceDelay[1]));
        }

        if (myToken !== tokenRef.current) return;
        await sleep(pauseMs);

        for (let i = 1; i <= newMid.length; i++) {
          if (myToken !== tokenRef.current) return;
          setDisplayed(prefix + newMid.slice(0, i) + suffix);
          const ch = newMid.charAt(i - 1);
          const base = rand(typeDelay[0], typeDelay[1]);
          const extra = hardChars.test(ch)
            ? rand(hardCharExtraDelay[0], hardCharExtraDelay[1])
            : 0;
          await sleep(base + extra);
        }
      })();
    }, [
      value,
      disabled,
      typeDelay,
      backspaceDelay,
      hardChars,
      hardCharExtraDelay,
      pauseMs,
    ]);

    return (
      <span
        ref={ref}
        className={`royui-textmorph ${className}`.trim()}
        aria-live="polite"
        {...rest}
      >
        {renderText ? renderText(displayed) : displayed}
      </span>
    );
  },
);
