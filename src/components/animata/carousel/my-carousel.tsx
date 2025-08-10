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
}

const inrange = (v: number, min: number, max: number) => {
  if (v < min) return min;
  if (v > max) return max;
  return v;
};

export default function MyCarousel({
  items: initialItems,
  injectedIndex,
}: IMyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(injectedIndex ?? 0);

  useEffect(() => {
    setCurrentIndex(injectedIndex ?? 0);
  }, [injectedIndex]);

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % initialItems.length);
    localStorage.setItem(
      'injectedIndex',
      ((currentIndex + 1) % initialItems.length).toString(),
    );
  };

  const handlePrev = () => {
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + initialItems.length) % initialItems.length,
    );
    localStorage.setItem(
      'injectedIndex',
      (
        (currentIndex - 1 + initialItems.length) %
        initialItems.length
      ).toString(),
    );
  };

  const visibleIndices = [
    (currentIndex - 1 + initialItems.length) % initialItems.length,
    currentIndex,
    (currentIndex + 1) % initialItems.length,
  ];

  const visibleItems = visibleIndices.map(index => initialItems[index]);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const calculateTransform = (index: number) => {
    if (isMobile) {
      if (index === 1) {
        return 'translateX(-50%) scale(1.1)';
      }
      if (index === 0) {
        return 'translateX(-75%) rotate(-10deg)';
      }
      return 'translateX(-25%) rotate(10deg)';
    } else {
      if (index === 1) {
        return 'translateX(-50%) scale(1.1)';
      }
      if (index === 0) {
        return 'translateX(-150%) rotate(-20deg)';
      }
      return 'translateX(50%) rotate(20deg)';
    }
  };

  return (
    <div>
      <div className="w-full h-[300px] bg-red-100 z-100">
        <div
          onClick={handlePrev}
          className="navigation-item-left absolute left-2 top-[45%] z-20 flex h-10 w-10 translate-y-[-50%] cursor-pointer items-center justify-center rounded-lg bg-gray-400 bg-opacity-40 bg-clip-padding backdrop-blur-sm backdrop-filter"
        >
          <ChevronLeft className="text-gray-800" />
        </div>
        <div
          onClick={handleNext}
          className="navigation-item-right absolute right-2 top-[45%] z-20 flex h-10 w-10 translate-y-[-50%] cursor-pointer items-center justify-center rounded-lg bg-gray-300 bg-opacity-40 bg-clip-padding backdrop-blur-sm backdrop-filter"
        >
          <ChevronRight className="text-gray-800" />
        </div>
        {visibleItems.map((item, index) => (
          <div
            key={item?.id ?? 1}
            className={'absolute left-[50%] top-[30%] z-10 animate-fadeIn'}
            style={{
              transform: calculateTransform(index),
              transition: 'transform 0.5s ease, filter 0.5s ease',
              filter: index === 1 ? 'none' : 'blur(4px)',
              zIndex: index === 1 ? 3 : 1,
            }}
            {...registDragEvent({
              onDragEnd: deltaX => {
                const maxIndex = initialItems.length - 1;

                if (deltaX < -10)
                  setCurrentIndex(inrange(currentIndex + 1, 0, maxIndex));
                if (deltaX > 10)
                  setCurrentIndex(inrange(currentIndex - 1, 0, maxIndex));
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
            />
          </div>
        ))}
      </div>
    </div>
  );
}
