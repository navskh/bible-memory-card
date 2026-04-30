'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollText, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const LogButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(`${today}-count`);
    setCount(raw ? Number(raw) : 0);
  }, [isOpen]);

  return (
    <button
      type="button"
      onClick={() => setIsOpen(prev => !prev)}
      className={
        'group absolute bottom-5 left-5 z-20 flex cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-zinc-200 bg-white/90 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-md shadow-zinc-900/5 backdrop-blur transition-all hover:bg-white hover:shadow-lg hover:shadow-zinc-900/10 active:scale-95 ' +
        (isOpen ? 'ring-2 ring-amber-500/30' : '')
      }
      aria-expanded={isOpen}
    >
      <span className="flex size-5 items-center justify-center text-amber-600">
        <ScrollText className="size-4" strokeWidth={2.5} />
      </span>
      <span className="tracking-tight">암송내역</span>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.span
            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
            animate={{ width: 'auto', opacity: 1, marginLeft: 4 }}
            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
          >
            <span className="h-4 w-px bg-zinc-200" />
            {count > 0 ? (
              <span className="text-amber-700">
                오늘 <span className="font-bold">{count}</span>회
              </span>
            ) : (
              <span className="text-zinc-500">기록 없음</span>
            )}
            <X
              className="size-3.5 text-zinc-400 transition-colors group-hover:text-zinc-600"
              strokeWidth={2.5}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default LogButton;
