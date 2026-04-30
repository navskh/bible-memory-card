'use client';
import { RotateCcw } from 'lucide-react';

const InitButton = () => {
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm('모든 데이터를 초기화하시겠습니까?')) {
          localStorage.clear();
          window.location.reload();
        }
      }}
      className="group absolute bottom-5 right-5 z-20 flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-md shadow-zinc-900/5 backdrop-blur transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:shadow-lg hover:shadow-rose-900/10 active:scale-95"
    >
      <span className="flex size-5 items-center justify-center text-zinc-400 transition-colors group-hover:text-rose-500">
        <RotateCcw className="size-4" strokeWidth={2.5} />
      </span>
      <span className="tracking-tight">초기화</span>
    </button>
  );
};

export default InitButton;
