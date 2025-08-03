'use client';

import { Loader2 } from 'lucide-react';

interface NewLoadingScreenProps {
  message?: string;
}

export default function NewLoadingScreen({
  message = 'DEP242 데이터를 불러오는 중...',
}: NewLoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-black animate-spin mx-auto mb-4" />
        <p className="text-black/80">{message}</p>
      </div>
    </div>
  );
}
