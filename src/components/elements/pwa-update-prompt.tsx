'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, RefreshCw, Info, Clock } from 'lucide-react';

export default function PWAUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 업데이트 발견 이벤트 리스너
    const handleUpdateFound = () => {
      console.log('업데이트 알림 표시');
      setShowUpdatePrompt(true);

      // 이전 타이머가 있으면 정리
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }

      // 30초 후 자동으로 숨김
      autoHideTimerRef.current = setTimeout(() => {
        setShowUpdatePrompt(false);
      }, 30000);
    };

    window.addEventListener('sw-update-found', handleUpdateFound);

    return () => {
      window.removeEventListener('sw-update-found', handleUpdateFound);
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
    };
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      // Service Worker에 업데이트 적용 메시지 전송
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SKIP_WAITING',
        });
      }

      // 잠시 대기 후 페이지 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('업데이트 중 오류:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  };

  const handleRemindLater = () => {
    setShowUpdatePrompt(false);
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }

    // 5분 후 다시 알림 표시
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('sw-update-found'));
    }, 5 * 60 * 1000);
  };

  if (!showUpdatePrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-lg shadow-lg border border-blue-200 p-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-1 flex items-center">
            <Info className="w-4 h-4 mr-2" />
            새로운 버전이 있습니다
          </h3>
          <p className="text-xs text-gray-600">
            최신 기능과 개선사항을 적용하려면 업데이트하세요
          </p>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            30초 후 자동으로 사라집니다
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleUpdate}
          disabled={isUpdating}
          size="sm"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`}
          />
          {isUpdating ? '업데이트 중...' : '지금 업데이트'}
        </Button>
        <Button
          onClick={handleRemindLater}
          variant="outline"
          size="sm"
          disabled={isUpdating}
        >
          나중에
        </Button>
      </div>
    </div>
  );
}
