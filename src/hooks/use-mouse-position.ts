import { useEffect } from 'react';

export function useMousePosition(
  ref: React.RefObject<HTMLElement | HTMLDivElement | null>,
  callback?: ({ x, y }: { x: number; y: number }) => void,
) {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { top, left } = ref.current?.getBoundingClientRect() || {
        top: 0,
        left: 0,
      };

      callback?.({ x: clientX - left, y: clientY - top });
    };

    const handleTouchMove = (event: TouchEvent) => {
      const { clientX, clientY } = event.touches[0] ?? {
        clientX: 0,
        clientY: 0,
      };
      const { top, left } = ref.current?.getBoundingClientRect() || {
        top: 0,
        left: 0,
      };

      callback?.({ x: clientX - left, y: clientY - top });
    };

    ref.current?.addEventListener(
      'mousemove',
      handleMouseMove as EventListener,
    );
    ref.current?.addEventListener(
      'touchmove',
      handleTouchMove as EventListener,
    );

    const nodeRef = ref.current;
    return () => {
      nodeRef?.removeEventListener(
        'mousemove',
        handleMouseMove as EventListener,
      );
      nodeRef?.removeEventListener(
        'touchmove',
        handleTouchMove as EventListener,
      );
    };
  }, [ref, callback]);
}
