import { useEffect } from 'react';
import { useCourseStore, COURSE_STORAGE_KEY } from '../store/courseStore';

export function useCourseAutoStatusSync() {
  useEffect(() => {
    useCourseStore.getState().reconcileAll();

    function handleStorage(event: StorageEvent) {
      if (event.key === COURSE_STORAGE_KEY || event.key === null) {
        useCourseStore.persist.rehydrate();
        useCourseStore.getState().reconcileAll();
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
}
