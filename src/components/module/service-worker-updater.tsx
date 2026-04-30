'use client';
import { useEffect } from 'react';

const CLEANUP_FLAG = 'sw-cleanup-v1-done';

export function ServiceWorkerUpdater() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (localStorage.getItem(CLEANUP_FLAG)) return;

    navigator.serviceWorker.getRegistrations().then(async registrations => {
      if (registrations.length === 0) {
        localStorage.setItem(CLEANUP_FLAG, '1');
        return;
      }

      await Promise.all(registrations.map(r => r.unregister()));
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      localStorage.setItem(CLEANUP_FLAG, '1');
      window.location.reload();
    });
  }, []);

  return null;
}
