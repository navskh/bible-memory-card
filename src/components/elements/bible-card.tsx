'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Check, EyeOff } from 'lucide-react';
import { BibleMemoryCard } from '@/types/bible-card';
import { useState, useCallback, useEffect } from 'react';

interface BibleCardProps {
  card: BibleMemoryCard;
  cardIndex: number;
  totalCards: number;
  isChecked: boolean;
  onCheckToggle: (cardId: string) => void;
}

export default function BibleCard({
  card,
  cardIndex,
  totalCards,
  isChecked,
  onCheckToggle,
}: BibleCardProps) {
  const [isVerseVisible, setIsVerseVisible] = useState(false);
  const [isClickDisabled, setIsClickDisabled] = useState(false);

  // 카드가 변경될 때마다 구절을 숨김 상태로 리셋
  useEffect(() => {
    setIsVerseVisible(false);
    setIsClickDisabled(false);
  }, [card.id]);

  const handleVerseClick = useCallback(() => {
    if (isClickDisabled) return;

    setIsClickDisabled(true);
    setIsVerseVisible(true); // 항상 true로 설정하여 한 번 보이면 계속 보이도록

    // 300ms 후에 다시 클릭 가능하도록 설정
    setTimeout(() => {
      setIsClickDisabled(false);
    }, 300);
  }, [isClickDisabled]);

  return (
    <Card className="w-full max-w-[700px] h-80 md:h-[28rem] bg-gradient-to-br from-white via-blue-50 to-indigo-100 border-2 border-indigo-200/50 shadow-2xl select-none backdrop-blur-sm mx-auto relative">
      <CardContent className="p-3 md:p-8 h-full flex flex-col justify-between relative">
        {/* 카드 내부 그림자 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 rounded-lg pointer-events-none"></div>

        {/* 체크박스 - 우상단 */}
        <button
          className={`absolute top-2 md:top-4 right-2 md:right-4 w-5 h-5 md:w-6 md:h-6 rounded border-2 flex items-center justify-center transition-colors z-20 ${
            isChecked
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400 bg-white/80'
          }`}
          onClick={e => {
            e.stopPropagation();
            onCheckToggle(card.id);
          }}
        >
          {isChecked && <Check className="w-3 h-3 md:w-4 md:h-4" />}
        </button>

        {/* 상단 제목 영역 */}
        <div className="relative z-10">
          <div className="text-center mb-2 md:mb-6">
            <h1 className="text-lg md:text-3xl font-bold text-indigo-800 mb-1 md:mb-2">
              {card.mainTitle}
            </h1>
            <div className="flex justify-center mb-2 md:mb-4">
              <div className="w-12 md:w-20 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
            </div>
            <h2 className="text-sm md:text-xl font-semibold text-gray-700 mb-1 md:mb-2">
              {card.subTitle}
            </h2>
            {card.subSubTitle && (
              <h3 className="text-xs md:text-base font-medium text-gray-600">
                {card.subSubTitle}
              </h3>
            )}
          </div>
        </div>

        {/* 메인 콘텐츠 - 성경 구절 */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <div className="text-center w-full px-2">
            <p className="text-base md:text-lg font-medium text-indigo-600 mb-1 md:mb-3">
              ({card.reference})
            </p>
            <div className="w-full">
              <div
                className={`cursor-pointer group w-full ${
                  isClickDisabled ? 'pointer-events-none' : ''
                }`}
                onClick={handleVerseClick}
              >
                {isVerseVisible ? (
                  <div className="min-h-[6rem] md:min-h-[10rem] flex items-center justify-center w-full">
                    <blockquote className="text-base md:text-xl leading-relaxed text-gray-800 font-medium transition-all duration-300 w-full max-w-full px-2">
                      {card.verse}
                    </blockquote>
                  </div>
                ) : (
                  <div className="min-h-[10rem] md:min-h-[14rem] flex flex-col items-center justify-center w-full px-8 md:px-16">
                    <div className="w-28 h-28 md:w-36 md:h-36 bg-indigo-100 rounded-full flex items-center justify-center mb-8 md:mb-10 group-hover:bg-indigo-200 transition-colors">
                      <EyeOff className="w-14 h-14 md:w-20 md:h-20 text-indigo-600" />
                    </div>
                    <div className="w-full flex justify-center">
                      <p className="text-xl md:text-3xl text-indigo-600 font-medium text-center">
                        클릭하여 구절 보기
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 하단 영역 */}
        <div className="relative z-10 mt-2 md:mt-4">
          {/* 카드 번호 */}
          <div className="text-center">
            <span className="text-xs md:text-sm text-gray-500">
              {cardIndex + 1} / {totalCards}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
