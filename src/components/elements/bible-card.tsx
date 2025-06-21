"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { BibleMemoryCard } from "@/types/bible-card"

interface BibleCardProps {
  card: BibleMemoryCard
  cardIndex: number
  totalCards: number
  isChecked: boolean
  onCheckToggle: (cardId: string) => void
}

export default function BibleCard({
  card,
  cardIndex,
  totalCards,
  isChecked,
  onCheckToggle,
}: BibleCardProps) {
  return (
    <Card className="w-full max-w-[700px] h-80 md:h-80 bg-gradient-to-br from-white via-blue-50 to-indigo-100 border-2 border-indigo-200/50 shadow-2xl select-none backdrop-blur-sm mx-auto relative">
      <CardContent className="p-4 md:p-8 h-full flex flex-col justify-between relative">
        {/* 카드 내부 그림자 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 rounded-lg pointer-events-none"></div>

        {/* 체크박스 - 우상단 */}
        <button
          className={`absolute top-4 right-4 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors z-20 ${
            isChecked
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-400 bg-white/80"
          }`}
          onClick={(e) => {
            e.stopPropagation()
            onCheckToggle(card.id)
          }}
        >
          {isChecked && <Check className="w-4 h-4" />}
        </button>

        {/* 상단 제목 영역 */}
        <div className="relative z-10">
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-indigo-800 mb-2">{card.mainTitle}</h1>
            <div className="flex justify-center mb-3 md:mb-4">
              <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">{card.subTitle}</h2>
            {card.subSubTitle && (
              <h3 className="text-sm md:text-base font-medium text-gray-600">{card.subSubTitle}</h3>
            )}
          </div>
        </div>

        {/* 메인 콘텐츠 - 성경 구절 */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <div className="text-center">
            <p className="text-base md:text-lg font-medium text-indigo-600 mb-2 md:mb-3">({card.reference})</p>
            <blockquote className="text-sm md:text-lg leading-relaxed text-gray-800 font-medium px-2 md:px-0">
              {card.verse}
            </blockquote>
          </div>
        </div>
        {/* 하단 영역 */}
        <div className="relative z-10">
          {/* 카드 번호 */}
          <div className="text-center">
            <span className="text-xs md:text-sm text-gray-500">
              {cardIndex + 1} / {totalCards}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 