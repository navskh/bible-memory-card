'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CardSkew from '../card/card-skew';
import { useMediaQuery } from '@/hooks/use-media-query';
import registDragEvent from '@/lib/register-drag-event';

interface ICarouselItem {
  id?: string;
  heading1?: string;
  heading2?: string;
  heading3?: string;
  verse?: string;
  text?: string;
}

interface IMyCarouselProps {
  items: ICarouselItem[];
  injectedIndex?: number;
  mode: '60v' | 'dep';
}

export default function MyCarousel({
  items: initialItems,
  injectedIndex,
  mode,
}: IMyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(injectedIndex ?? 0);

  useEffect(() => {
    setCurrentIndex(injectedIndex ?? 0);
  }, [injectedIndex]);

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % initialItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + initialItems.length) % initialItems.length,
    );
  };

  const visibleIndices = [
    (currentIndex - 1 + initialItems.length) % initialItems.length,
    currentIndex,
    (currentIndex + 1) % initialItems.length,
  ];

  const visibleItems = visibleIndices.map(index => initialItems[index]);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isLandscape = useMediaQuery(
    '(max-width: 900px) and (orientation: landscape)',
  );
  const calculateTransform = (index: number) => {
    if (isLandscape) {
      if (index === 1) {
        return 'translate(-50%, -50%) scale(1)';
      }
      if (index === 0) {
        return 'translate(-105%, -50%) rotate(-10deg) scale(0.8)';
      }
      return 'translate(5%, -50%) rotate(10deg) scale(0.8)';
    }
    if (isMobile) {
      if (index === 1) {
        return 'translate(-50%, -50%) scale(1)';
      }
      if (index === 0) {
        return 'translate(-130%, -50%) rotate(-12deg) scale(0.8)';
      }
      return 'translate(30%, -50%) rotate(12deg) scale(0.8)';
    } else {
      if (index === 1) {
        return 'translate(-50%, -50%) scale(1.1)';
      }
      if (index === 0) {
        return 'translate(-115%, -50%) rotate(-15deg) scale(0.85)';
      }
      return 'translate(15%, -50%) rotate(15deg) scale(0.85)';
    }
  };

  return (
    <div className="w-full overflow-x-hidden flex items-center justify-center">
      <div className="relative w-full min-h-[60vh] [@media(max-height:500px)]:min-h-[90vh] flex items-center justify-center">
        <div
          onClick={handlePrev}
          className="navigation-item-left absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-gray-400/40 bg-clip-padding backdrop-blur-sm backdrop-filter"
        >
          <ChevronLeft className="text-gray-800" />
        </div>
        <div
          onClick={handleNext}
          className="navigation-item-right absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-gray-300/40 bg-clip-padding backdrop-blur-sm backdrop-filter"
        >
          <ChevronRight className="text-gray-800" />
        </div>
        {visibleItems.map((item, index) => (
          <div
            key={item?.id ?? 1}
            className={'absolute left-1/2 top-1/2 z-10 animate-fadeIn touch-pan-y select-none'}
            style={{
              transform: calculateTransform(index),
              transition: 'transform 0.5s ease, filter 0.5s ease',
              filter: index === 1 ? 'none' : 'blur(4px)',
              zIndex: index === 1 ? 3 : 1,
            }}
            {...registDragEvent({
              onDragEnd: deltaX => {
                const len = initialItems.length;
                if (deltaX < -50)
                  setCurrentIndex(prev => (prev + 1) % len);
                if (deltaX > 50)
                  setCurrentIndex(prev => (prev - 1 + len) % len);
              },
            })}
          >
            <CardSkew
              heading1={item?.heading1}
              heading2={item?.heading2}
              heading3={item?.heading3}
              verse={item?.verse}
              text={item?.text}
              isFocus={index === 1}
              mode={mode}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
