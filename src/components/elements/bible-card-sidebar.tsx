'use client';

import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import { BibleMemoryCard } from '@/types/bible-card';

interface BibleCardSidebarProps {
  memoryCards: BibleMemoryCard[];
  currentIndex: number;
  checkedCards: Set<string>;
  sidebarOpen: boolean;
  onSidebarClose: () => void;
  onCardSelect: (index: number) => void;
  onCheckToggle: (cardId: string) => void;
}

export default function BibleCardSidebar({
  memoryCards,
  currentIndex,
  checkedCards,
  sidebarOpen,
  onSidebarClose,
  onCardSelect,
  onCheckToggle,
}: BibleCardSidebarProps) {
  // 날짜별로 카드들을 그룹화
  const groupedCards = memoryCards.reduce((groups, card) => {
    const day = card.day;
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(card);
    return groups;
  }, {} as Record<number, BibleMemoryCard[]>);

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-md border-r border-indigo-200/50 shadow-xl z-50 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-80`}
    >
      <div className="p-6 h-full flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-indigo-800">
            DEP242 암송 카드
          </h2>
          <Button variant="ghost" size="sm" onClick={onSidebarClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 진행률 */}
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
          <div className="text-sm text-indigo-600 mb-2">
            암송 완료: {checkedCards.size} / {memoryCards.length}
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(checkedCards.size / memoryCards.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* 카드 목록 */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {Object.entries(groupedCards).map(([day, cards]) => (
            <div key={day} className="space-y-2">
              {/* 날짜 헤더 */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-sm py-2 border-b border-gray-200">
                <h3 className="font-semibold text-indigo-700 text-base">
                  {day}일차
                </h3>
              </div>

              {/* 해당 날짜의 카드들 */}
              {cards.map(card => {
                const cardIndex = memoryCards.findIndex(c => c.id === card.id);
                return (
                  <div
                    key={card.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      cardIndex === currentIndex
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-25'
                    }`}
                    onClick={() => onCardSelect(cardIndex)}
                  >
                    <div className="flex items-start gap-3">
                      {/* 체크박스 */}
                      <button
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          checkedCards.has(card.id)
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                        onClick={e => {
                          e.stopPropagation();
                          onCheckToggle(card.id);
                        }}
                      >
                        {checkedCards.has(card.id) && (
                          <Check className="w-3 h-3" />
                        )}
                      </button>

                      {/* 카드 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 text-sm mb-1">
                          {card.subTitle}
                        </div>
                        {card.subSubTitle && (
                          <div className="text-sm text-gray-600 mb-1">
                            {card.subSubTitle}
                          </div>
                        )}
                        <div className="text-sm text-indigo-600 mb-1">
                          ({card.reference})
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {card.verse.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
