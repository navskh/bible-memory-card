'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useMousePosition } from '@/hooks/use-mouse-position';
import { cn } from '@/lib/utils';
import { Check, EyeOff } from 'lucide-react';
import registDragEvent from '@/lib/register-drag-event';

function calculateCardRotation({
  currentX,
  currentY,
  centerX,
  centerY,
  maxRotationX,
  maxRotationY,
}: {
  currentX: number;
  currentY: number;
  centerX: number;
  centerY: number;
  maxRotationX: number;
  maxRotationY: number;
}) {
  const deltaX = currentX - centerX;
  const deltaY = currentY - centerY;

  const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
  const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  const rotationFactor = distance / maxDistance;

  const rotationY = (
    (-deltaX / centerX) *
    maxRotationY *
    rotationFactor
  ).toFixed(2);
  const rotationX = (
    (deltaY / centerY) *
    maxRotationX *
    rotationFactor
  ).toFixed(2);
  return { rotationX, rotationY };
}
const SLIDER_WIDTH = 40;

const inrange = (v: number, min: number, max: number) => {
  if (v < min) return min;
  if (v > max) return max;
  return v;
};

export default function CardSkew({
  className,
  heading1,
  heading2,
  heading3,
  verse,
  text,
  isFocus,
  mode,
}: {
  className?: string;
  heading1?: string;
  heading2?: string;
  heading3?: string;
  verse?: string;
  text?: string;
  isFocus?: boolean;
  mode: '60v' | 'dep';
}) {
  const [isView, setIsView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<NodeJS.Timeout | null>(null);
  const [transX, setTransX] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const cardKey = `${heading1}-${heading2}-${heading3}`;
  const checkKey = `${mode}:${cardKey}`;

  const update = useCallback(({ x, y }: { x: number; y: number }) => {
    if (!containerRef.current) {
      return;
    }

    const { width, height } = containerRef.current.getBoundingClientRect();
    const { rotationX, rotationY } = calculateCardRotation({
      centerX: width / 2,
      centerY: height / 2,
      currentX: x,
      currentY: y,
      maxRotationX: 4,
      maxRotationY: 6,
    });
    containerRef.current.style.setProperty('--x', `${rotationX}deg`);
    containerRef.current.style.setProperty('--y', `${rotationY}deg`);
  }, []);

  useMousePosition(containerRef, update);

  useEffect(() => {
    let stored = localStorage.getItem(checkKey);
    if (stored === null) {
      const legacy = localStorage.getItem(cardKey);
      if (legacy !== null) {
        localStorage.setItem(checkKey, legacy);
        stored = legacy;
      }
    }
    setIsChecked(stored === 'true');
  }, [checkKey, cardKey]);

  return (
    <div
      onClick={() => {
        if (isFocus) {
          setIsView(true);
        }
      }}
      onDoubleClick={e => {
        e.preventDefault();
        e.stopPropagation();
        if (isFocus) {
          setIsView(false);
        }
      }}
      {...registDragEvent({
        onDragChange: deltaX => {
          if (isFocus) {
            setTransX(inrange(deltaX, -SLIDER_WIDTH + 10, SLIDER_WIDTH - 10));
          }
        },
      })}
      ref={containerRef}
      className={cn(
        'flex w-[78vw] max-w-100 min-w-72 sm:min-w-80 transform-gpu flex-col gap-2 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 text-zinc-900 shadow-2xl shadow-zinc-900/10 transition-transform ease-linear will-change-transform',
        className,
      )}
      style={{
        transform: `translateX(${transX}px) perspective(400px) rotateX(var(--x)) rotateY(var(--y))`,
        transitionDuration: '50ms',
      }}
      onMouseEnter={() => {
        resetRef.current = setTimeout(() => {
          if (!containerRef.current) {
            return;
          }

          // Reset the transition duration to 0 so that the mouse movement is smooth
          containerRef.current.style.transitionDuration = '0ms';
        }, 300);
      }}
      onMouseLeave={() => {
        if (resetRef.current) {
          clearTimeout(resetRef.current);
          resetRef.current = null;
        }
        if (!containerRef.current) {
          return;
        }

        containerRef.current.style.transitionDuration = '50ms';
        containerRef.current.style.setProperty('--x', '0deg');
        containerRef.current.style.setProperty('--y', '0deg');
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-base font-semibold tracking-tight text-zinc-900 select-none">
          {heading1}
        </p>
        <button
          type="button"
          aria-pressed={isChecked}
          aria-label={isChecked ? '암송 완료 해제' : '암송 완료'}
          onClick={e => {
            e.stopPropagation();
            const next = !isChecked;
            localStorage.setItem(checkKey, String(next));

            const today = new Date().toISOString().split('T')[0];
            const countedKey = `${mode}:counted:${today}:${cardKey}`;
            const currentCount = Number(
              localStorage.getItem(`${today}-count`) ?? 0,
            );

            if (next && !localStorage.getItem(countedKey)) {
              localStorage.setItem(
                `${today}-count`,
                String(currentCount + 1),
              );
              localStorage.setItem(countedKey, '1');
            } else if (!next && localStorage.getItem(countedKey)) {
              localStorage.setItem(
                `${today}-count`,
                String(Math.max(0, currentCount - 1)),
              );
              localStorage.removeItem(countedKey);
            }

            setIsChecked(next);
          }}
          className={cn(
            'flex size-8 items-center justify-center rounded-full border transition-colors',
            isChecked
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-zinc-300 bg-white text-zinc-400 hover:border-zinc-400',
          )}
        >
          <Check
            className={cn(
              'size-4 transition-opacity',
              isChecked ? 'opacity-100' : 'opacity-60',
            )}
            strokeWidth={2.5}
          />
        </button>
      </div>

      <p className="font-mono text-base text-zinc-700 tracking-tight select-none">
        {heading2}
      </p>
      <p className="font-mono text-base text-zinc-700 tracking-tight select-none">
        {heading3}
      </p>

      <span className="mt-2 inline-block text-sm font-bold uppercase tracking-widest text-amber-600 select-none">
        {verse}
      </span>

      <div className="mt-1 text-base font-medium text-zinc-700 break-keep whitespace-pre-line select-none">
        {isView ? (
          text
        ) : (
          <EyeOff className="w-14 h-14 md:w-20 md:h-25 text-zinc-300" />
        )}
      </div>
    </div>
  );
}
