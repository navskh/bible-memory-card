'use client';
import { useCallback, useRef, useState } from 'react';

import { useMousePosition } from '@/hooks/use-mouse-position';
import { cn } from '@/lib/utils';
import { EyeOff } from 'lucide-react';
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
const SLIDER_WIDTH = 400;

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
}: {
  className?: string;
  heading1?: string;
  heading2?: string;
  heading3?: string;
  verse?: string;
  text?: string;
  isFocus?: boolean;
}) {
  const [isView, setIsView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<NodeJS.Timeout | null>(null);
  const [transX, setTransX] = useState(0);

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

  return (
    <div
      onClick={() => {
        if (isFocus) {
          setIsView(true);
        }
      }}
      onDoubleClick={() => {
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
        'flex max-w-100 min-w-70 transform-gpu flex-col gap-1 rounded-3xl border border-border bg-zinc-700 p-10 text-zinc-200 shadow-lg transition-transform ease-linear will-change-transform',
        className,
      )}
      style={{
        transform: `perspective(400px) rotateX(var(--x)) rotateY(var(--y))`,
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
      <p className="font-mono text-l tracking-tight select-none">{heading1}</p>
      <p className="font-mono text-l tracking-tight select-none">{heading2}</p>
      <p className="font-mono text-l tracking-tight select-none">{heading3}</p>

      <span className="text-m font-bold text-zinc-400 select-none">
        {verse}
      </span>

      <p className="text-m font-medium text-zinc-400 break-keep whitespace-pre-line select-none">
        {isView ? text : <EyeOff className="w-14 h-14 md:w-20 md:h-20" />}
      </p>
    </div>
  );
}
