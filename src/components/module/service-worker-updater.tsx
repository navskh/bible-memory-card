'use client';
import { useEffect } from 'react';

export function ServiceWorkerUpdater() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.ready.then(registration => {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                const ok = window.confirm(
                  '새 버전이 있습니다. 업데이트 하시겠습니까?',
                );
                if (ok) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'activated') {
                      window.location.reload();
                    }
                  });
                }
              }
            });
          });
        });
      });
    }
  }, []);

  return null;
}
