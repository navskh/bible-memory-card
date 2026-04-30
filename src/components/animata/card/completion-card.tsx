'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOTAL_DEP_DAYS = 14;

interface ICompletionCardProps {
  mode: '60v' | 'dep';
  day: string;
  cards: Array<{
    heading1?: string;
    heading2?: string;
    heading3?: string;
  }>;
  isFocus?: boolean;
  onResetToStart: () => void;
  className?: string;
}

export default function CompletionCard({
  mode,
  day,
  cards,
  isFocus,
  onResetToStart,
  className,
}: ICompletionCardProps) {
  const router = useRouter();
  const [checkedCount, setCheckedCount] = useState(0);
  const total = cards.length;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let count = 0;
    for (const card of cards) {
      const cardKey = `${card.heading1}-${card.heading2}-${card.heading3}`;
      const checkKey = `${mode}:${cardKey}`;
      if (localStorage.getItem(checkKey) === 'true') count += 1;
    }
    setCheckedCount(count);
  }, [cards, mode, isFocus]);

  const isAllChecked = total > 0 && checkedCount >= total;
  const dayNum = parseInt(day, 10);
  const isVerseMode = mode === '60v';
  const isLastDay = !isVerseMode && dayNum >= TOTAL_DEP_DAYS;

  let buttonLabel: string;
  let ButtonIcon = ArrowRight;
  let onClick: () => void;

  if (isVerseMode) {
    buttonLabel = '처음으로 돌아가기';
    ButtonIcon = RotateCcw;
    onClick = onResetToStart;
  } else if (isLastDay) {
    buttonLabel = '1일차로 돌아가기';
    ButtonIcon = RotateCcw;
    onClick = () => router.push('/dep/1');
  } else {
    buttonLabel = `${dayNum + 1}일차 시작하기`;
    ButtonIcon = ArrowRight;
    onClick = () => router.push(`/dep/${dayNum + 1}`);
  }

  const headline = isVerseMode ? '60구절 끝!' : `${day}일차 끝!`;
  const subline = isAllChecked
    ? '모든 구절 암송 완료'
    : `${checkedCount} / ${total} 구절 암송`;

  return (
    <div
      className={cn(
        'flex w-[78vw] max-w-100 min-w-72 sm:min-w-80 [@media(max-height:500px)]:w-[55vw] [@media(max-height:500px)]:min-w-0 [@media(max-height:500px)]:max-h-[88vh] [@media(max-height:500px)]:overflow-y-auto transform-gpu flex-col items-center justify-center gap-4 [@media(max-height:500px)]:gap-2 rounded-3xl border bg-white p-8 sm:p-10 [@media(max-height:500px)]:p-4 text-zinc-900 shadow-2xl',
        isAllChecked
          ? 'border-emerald-200 shadow-emerald-500/15'
          : 'border-zinc-200 shadow-zinc-900/10',
        className,
      )}
    >
      <div
        className={cn(
          'flex size-16 [@media(max-height:500px)]:size-10 items-center justify-center rounded-full transition-colors',
          isAllChecked
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-amber-100 text-amber-600',
        )}
      >
        {isAllChecked ? (
          <Sparkles
            className="size-8 [@media(max-height:500px)]:size-5"
            strokeWidth={2.5}
          />
        ) : (
          <Check
            className="size-8 [@media(max-height:500px)]:size-5"
            strokeWidth={2.5}
          />
        )}
      </div>

      <div className="flex flex-col items-center gap-1 text-center select-none">
        <h3 className="text-xl [@media(max-height:500px)]:text-base font-bold tracking-tight text-zinc-900">
          {headline}
        </h3>
        <p
          className={cn(
            'text-sm font-medium tracking-tight',
            isAllChecked ? 'text-emerald-700' : 'text-zinc-600',
          )}
        >
          {subline}
        </p>
      </div>

      <div className="w-full max-w-xs">
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isAllChecked ? 'bg-emerald-500' : 'bg-amber-500',
            )}
            style={{
              width: total > 0 ? `${(checkedCount / total) * 100}%` : '0%',
            }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onClick();
        }}
        className={cn(
          'mt-1 flex items-center gap-2 rounded-full px-5 py-2.5 [@media(max-height:500px)]:py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95',
          isAllChecked
            ? 'bg-emerald-500 hover:bg-emerald-600'
            : 'bg-amber-500 hover:bg-amber-600',
        )}
      >
        <span>{buttonLabel}</span>
        <ButtonIcon className="size-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
