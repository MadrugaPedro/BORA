import { useSyncExternalStore } from 'react';

function assinar(aoMudar: () => void) {
  window.addEventListener('online', aoMudar);
  window.addEventListener('offline', aoMudar);
  return () => {
    window.removeEventListener('online', aoMudar);
    window.removeEventListener('offline', aoMudar);
  };
}

export function useOnline(): boolean {
  return useSyncExternalStore(assinar, () => navigator.onLine);
}
