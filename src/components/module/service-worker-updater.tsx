'use client';
import { useEffect } from 'react';

export function ServiceWorkerUpdater() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      console.log('ServiceWorkerUpdater', navigator.serviceWorker);
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('registrations', registrations);
        for (const registration of registrations) {
          registration.unregister().then(isUnregistered => {
            console.log('isUnregistered', isUnregistered);
            if (isUnregistered) {
              console.log('기존 service-worker 제거 완료');
              // 강제로 새로 등록
              navigator.serviceWorker
                .register('/sw.js')
                .then(() => console.log('새 service-worker 등록됨'))
                .catch(console.error);
            }
          });
        }
      });
    }
  }, []);

  return null;
}
