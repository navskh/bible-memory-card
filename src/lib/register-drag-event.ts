export default function registDragEvent({
  onDragChange,
  onDragEnd,
  onDragCancel,
  stopPropagation,
}: {
  onDragChange?: (deltaX: number, deltaY: number) => void;
  onDragEnd?: (deltaX: number, deltaY: number) => void;
  onDragCancel?: () => void;
  stopPropagation?: boolean;
}) {
  return {
    onPointerDown: (downEvent: React.PointerEvent<HTMLDivElement>) => {
      if (!downEvent.isPrimary || downEvent.button !== 0) return;
      if (stopPropagation) downEvent.stopPropagation();

      const startX = downEvent.clientX;
      const startY = downEvent.clientY;
      const pointerId = downEvent.pointerId;

      const cleanup = () => {
        document.removeEventListener('pointermove', moveHandler);
        document.removeEventListener('pointerup', upHandler);
        document.removeEventListener('pointercancel', cancelHandler);
      };

      const moveHandler = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (moveEvent.cancelable) moveEvent.preventDefault();
          onDragChange?.(deltaX, deltaY);
        } else {
          onDragChange?.(0, deltaY);
        }
      };

      const upHandler = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;
        cleanup();
        onDragEnd?.(upEvent.clientX - startX, upEvent.clientY - startY);
      };

      const cancelHandler = (cancelEvent: PointerEvent) => {
        if (cancelEvent.pointerId !== pointerId) return;
        cleanup();
        onDragCancel?.();
      };

      document.addEventListener('pointermove', moveHandler);
      document.addEventListener('pointerup', upHandler);
      document.addEventListener('pointercancel', cancelHandler);
    },
  };
}
