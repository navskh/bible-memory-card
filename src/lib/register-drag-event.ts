export default function registDragEvent({
  onDragChange,
  onDragEnd,
  stopPropagation,
}: {
  onDragChange?: (deltaX: number, deltaY: number) => void;
  onDragEnd?: (deltaX: number, deltaY: number) => void;
  stopPropagation?: boolean;
}) {
  return {
    onPointerDown: (downEvent: React.PointerEvent<HTMLDivElement>) => {
      if (stopPropagation) downEvent.stopPropagation();

      const startX = downEvent.pageX;
      const startY = downEvent.pageY;
      const pointerId = downEvent.pointerId;

      const moveHandler = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;
        if (moveEvent.cancelable) moveEvent.preventDefault();
        onDragChange?.(moveEvent.pageX - startX, moveEvent.pageY - startY);
      };

      const upHandler = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;
        onDragEnd?.(upEvent.pageX - startX, upEvent.pageY - startY);
        document.removeEventListener('pointermove', moveHandler);
        document.removeEventListener('pointercancel', upHandler);
      };

      document.addEventListener('pointermove', moveHandler);
      document.addEventListener('pointerup', upHandler, { once: true });
      document.addEventListener('pointercancel', upHandler, { once: true });
    },
  };
}
