'use client';

import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';

export default function TestUpdateButton() {
  const simulateUpdate = () => {
    // 테스트용 업데이트 이벤트 발생
    window.dispatchEvent(new CustomEvent('sw-update-found'));
    console.log('테스트 업데이트 이벤트 발생');
  };

  const forceUpdate = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('강제 업데이트 확인 완료');
      }
    }
  };

  const clearCache = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_CACHE',
      });
      console.log('캐시 무효화 요청 전송');
    }
  };

  // 개발 모드에서만 표시
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 z-50">
      <div className="flex items-center mb-2">
        <TestTube className="w-4 h-4 mr-2 text-yellow-600" />
        <span className="text-sm font-semibold text-yellow-800">
          테스트 도구
        </span>
      </div>

      <div className="space-y-2">
        <Button
          onClick={simulateUpdate}
          size="sm"
          variant="outline"
          className="w-full text-xs"
        >
          업데이트 알림 시뮬레이션
        </Button>

        <Button
          onClick={forceUpdate}
          size="sm"
          variant="outline"
          className="w-full text-xs"
        >
          강제 업데이트 확인
        </Button>

        <Button
          onClick={clearCache}
          size="sm"
          variant="outline"
          className="w-full text-xs"
        >
          캐시 무효화
        </Button>
      </div>
    </div>
  );
}
