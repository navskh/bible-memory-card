import { useState, useRef, useEffect, useCallback } from "react"

interface UseBibleCardInteractionProps {
  totalCards: number
  currentIndex: number
  onIndexChange: (index: number) => void
}

export function useBibleCardInteraction({
  totalCards,
  currentIndex,
  onIndexChange,
}: UseBibleCardInteractionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<"next" | "prev">("next")
  const cardRef = useRef<HTMLDivElement>(null)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const clickPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isAnimating) return
    setIsDragging(true)
    setStartX(e.clientX)
    setStartY(e.clientY)
    clickPositionRef.current = { x: e.clientX, y: e.clientY }
    e.preventDefault()
  }, [isAnimating])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAnimating) return
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
    clickPositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    e.preventDefault()
  }, [isAnimating])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isAnimating) return

    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    const maxRotation = 25
    const newRotateY = Math.max(-maxRotation, Math.min(maxRotation, deltaX / 10))
    const newRotateX = Math.max(-maxRotation, Math.min(maxRotation, -deltaY / 10))

    setRotateY(newRotateY)
    setRotateX(newRotateX)
  }, [isDragging, isAnimating, startX, startY])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || isAnimating) return

    const deltaX = e.touches[0].clientX - startX
    const deltaY = e.touches[0].clientY - startY

    const maxRotation = 25
    const newRotateY = Math.max(-maxRotation, Math.min(maxRotation, deltaX / 10))
    const newRotateX = Math.max(-maxRotation, Math.min(maxRotation, -deltaY / 10))

    setRotateY(newRotateY)
    setRotateX(newRotateX)
  }, [isDragging, isAnimating, startX, startY])

  const handleEnd = useCallback(() => {
    setIsDragging(false)
    setRotateX(0)
    setRotateY(0)
  }, [])

  const handleDoubleClick = useCallback(() => {
    if (isAnimating) return

    const cardElement = cardRef.current
    if (!cardElement) return

    const cardRect = cardElement.getBoundingClientRect()
    const cardCenterX = cardRect.left + cardRect.width / 2
    const clickX = clickPositionRef.current.x

    const isLeftClick = clickX < cardCenterX

    let nextIndex: number
    if (isLeftClick) {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : totalCards - 1
      setAnimationDirection("prev")
    } else {
      nextIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0
      setAnimationDirection("next")
    }

    setIsAnimating(true)

    setTimeout(() => {
      onIndexChange(nextIndex)
    }, 250)

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }, [isAnimating, currentIndex, totalCards, onIndexChange])

  const handleClick = useCallback((e: React.MouseEvent) => {
    clickPositionRef.current = { x: e.clientX, y: e.clientY }

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
      handleDoubleClick()
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null
      }, 300)
    }
  }, [handleDoubleClick])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleEnd)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleEnd)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd])

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  return {
    isDragging,
    rotateX,
    rotateY,
    isAnimating,
    animationDirection,
    cardRef,
    handleMouseDown,
    handleTouchStart,
    handleClick,
  }
} 