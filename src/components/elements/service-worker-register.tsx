'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // 즉시 Service Worker 등록
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);

          // 업데이트 감지
          registration.addEventListener('updatefound', () => {
            console.log('새로운 Service Worker 업데이트 발견!');
            const newWorker = registration.installing;

            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                console.log('Service Worker 상태 변경:', newWorker.state);
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  console.log(
                    '새로운 버전이 설치되었습니다. 업데이트 알림을 보냅니다.',
                  );
                  // 업데이트 알림 이벤트 발생
                  window.dispatchEvent(new CustomEvent('sw-update-found'));
                }
              });
            }
          });

          // Service Worker가 업데이트되었을 때
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('새로운 Service Worker가 활성화되었습니다.');
            // 페이지 새로고침으로 새로운 버전 적용
            window.location.reload();
          });

          // 페이지 로드 완료 후 즉시 업데이트 확인
          if (document.readyState === 'complete') {
            registration.update();
          } else {
            window.addEventListener('load', () => {
              registration.update();
            });
          }

          // 주기적으로 업데이트 확인 (1시간마다)
          setInterval(() => {
            registration
              .update()
              .then(() => {
                console.log('주기적 업데이트 확인 완료');
              })
              .catch(error => {
                console.log('주기적 업데이트 확인 실패:', error);
              });
          }, 60 * 60 * 1000); // 1시간

          // 페이지 포커스 시 업데이트 확인
          const handleFocus = () => {
            registration
              .update()
              .then(() => {
                console.log('포커스 시 업데이트 확인 완료');
              })
              .catch(error => {
                console.log('포커스 시 업데이트 확인 실패:', error);
              });
          };

          window.addEventListener('focus', handleFocus);

          // 네트워크 상태 변경 시 업데이트 확인
          const handleOnline = () => {
            registration
              .update()
              .then(() => {
                console.log('온라인 상태에서 업데이트 확인 완료');
              })
              .catch(error => {
                console.log('온라인 상태에서 업데이트 확인 실패:', error);
              });
          };

          window.addEventListener('online', handleOnline);

          // 컴포넌트 언마운트 시 이벤트 리스너 정리
          return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('online', handleOnline);
          };
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return null;
}
