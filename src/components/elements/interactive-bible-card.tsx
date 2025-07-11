'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  load60VerseData,
  transform60VerseToBibleCards,
  loadDEP242Data,
  transformToBibleCards,
} from '@/lib/utils';
import { useBibleCardInteraction } from '@/hooks/use-bible-card-interaction';
import { BibleMemoryCard } from '@/types/bible-card';
import BibleCard from './bible-card';
import BibleCardSidebar from './bible-card-sidebar';
import LoadingScreen from './loading-screen';
import ErrorScreen from './error-screen';
import InstructionBar from './instruction-bar';

const CHECKED_CARDS_STORAGE_KEY = 'bible-memory-checked-cards';
const LAST_VIEWED_CARD_INDEX_KEY = 'bible-memory-last-viewed-index';
const CURRENT_MODE_KEY = 'bible-memory-current-mode';

type BibleMode = '60verse' | '242verse';

export default function InteractiveBibleCard() {
  const [memoryCards, setMemoryCards] = useState<BibleMemoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkedCards, setCheckedCards] = useState<Set<string>>(new Set());
  const [currentMode, setCurrentMode] = useState<BibleMode>('60verse');

  // localStorage에서 상태 복원
  useEffect(() => {
    try {
      // 체크된 카드 상태 복원
      const savedCheckedCards = localStorage.getItem(CHECKED_CARDS_STORAGE_KEY);
      if (savedCheckedCards) {
        const checkedCardsArray = JSON.parse(savedCheckedCards);
        setCheckedCards(new Set(checkedCardsArray));
      }

      // 마지막 본 카드 인덱스 복원
      const savedLastIndex = localStorage.getItem(LAST_VIEWED_CARD_INDEX_KEY);
      if (savedLastIndex) {
        const lastIndex = parseInt(savedLastIndex, 10);
        if (!isNaN(lastIndex) && lastIndex >= 0) {
          setCurrentIndex(lastIndex);
        }
      }

      // 현재 모드 복원
      const savedMode = localStorage.getItem(CURRENT_MODE_KEY);
      if (savedMode && (savedMode === '60verse' || savedMode === '242verse')) {
        setCurrentMode(savedMode as BibleMode);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }, []);

  // 체크된 카드 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      const checkedCardsArray = Array.from(checkedCards);
      localStorage.setItem(
        CHECKED_CARDS_STORAGE_KEY,
        JSON.stringify(checkedCardsArray),
      );
    } catch (error) {
      console.error('Failed to save checked cards to localStorage:', error);
    }
  }, [checkedCards]);

  // 현재 카드 인덱스가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(LAST_VIEWED_CARD_INDEX_KEY, currentIndex.toString());
    } catch (error) {
      console.error('Failed to save last viewed index to localStorage:', error);
    }
  }, [currentIndex]);

  // 현재 모드가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_MODE_KEY, currentMode);
    } catch (error) {
      console.error('Failed to save current mode to localStorage:', error);
    }
  }, [currentMode]);

  // 커스텀 훅으로 카드 인터랙션 로직 분리
  const {
    isDragging,
    rotateX,
    rotateY,
    isAnimating,
    animationDirection,
    cardRef,
    handleMouseDown,
    handleTouchStart,
    handleClick,
  } = useBibleCardInteraction({
    totalCards: memoryCards.length,
    currentIndex,
    onIndexChange: setCurrentIndex,
  });

  // 모드에 따라 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let cards: BibleMemoryCard[] = [];

        if (currentMode === '60verse') {
          const verseData = await load60VerseData();
          cards = transform60VerseToBibleCards(verseData);
        } else {
          const depData = await loadDEP242Data();
          cards = transformToBibleCards(depData);
        }

        setMemoryCards(cards);
        // 모드가 바뀌면 첫 번째 카드로 리셋
        setCurrentIndex(0);
        // 체크된 카드도 리셋 (모드가 바뀌면 다른 카드들이므로)
        setCheckedCards(new Set());
      } catch (error) {
        console.error(`Failed to load ${currentMode} data:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentMode]);

  const currentCard = memoryCards[currentIndex];

  const handleCardSelect = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
    setSidebarOpen(false); // 모바일에서 카드 선택 후 사이드바 닫기
  };

  const handleCheckToggle = (cardId: string) => {
    setCheckedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleModeToggle = () => {
    setCurrentMode(prev => (prev === '60verse' ? '242verse' : '60verse'));
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (loading) {
    return <LoadingScreen />;
  }

  // 데이터가 없을 때 표시할 컴포넌트
  if (memoryCards.length === 0) {
    return <ErrorScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex overflow-hidden">
      {/* 사이드바 */}
      <BibleCardSidebar
        memoryCards={memoryCards}
        currentIndex={currentIndex}
        checkedCards={checkedCards}
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
        onCardSelect={handleCardSelect}
        onCheckToggle={handleCheckToggle}
        currentMode={currentMode}
      />

      {/* 사이드바 오버레이 (모바일) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12 relative">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent"></div>

        {/* 사이드바 토글 버튼 */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 left-4 z-30 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-4 h-4 text-white" />
        </Button>

        {/* 모드 토글 버튼 */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 z-30 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
          onClick={handleModeToggle}
        >
          <span className="text-white font-medium">
            {currentMode === '60verse' ? '60구절' : '242구절'}
          </span>
        </Button>

        {/* 3D 카드 컨테이너 */}
        <div
          className="perspective-1000 relative"
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d',
            width: '100%',
            maxWidth: '800px',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            ref={cardRef}
            className="transform-gpu relative"
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: isDragging
                ? 'none'
                : isAnimating
                ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              transformStyle: 'preserve-3d',
              cursor: isAnimating
                ? 'default'
                : isDragging
                ? 'grabbing'
                : 'grab',
              animation: isAnimating
                ? animationDirection === 'next'
                  ? 'slideFromRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  : 'slideFromLeft 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                : 'none',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={handleClick}
          >
            <BibleCard
              card={currentCard}
              cardIndex={currentIndex}
              totalCards={memoryCards.length}
              isChecked={checkedCards.has(currentCard.id)}
              onCheckToggle={handleCheckToggle}
            />
          </div>
        </div>

        {/* 사용법 안내 */}
        <InstructionBar />
      </div>

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes slideFromRight {
          0% {
            transform: translateX(100vw) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateX(50vw) rotateX(0deg) rotateY(0deg);
          }
          100% {
            transform: translateX(0) rotateX(0deg) rotateY(0deg);
          }
        }

        @keyframes slideFromLeft {
          0% {
            transform: translateX(-100vw) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateX(-50vw) rotateX(0deg) rotateY(0deg);
          }
          100% {
            transform: translateX(0) rotateX(0deg) rotateY(0deg);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
