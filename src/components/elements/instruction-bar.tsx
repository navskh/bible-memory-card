"use client"

export default function InstructionBar() {
  return (
    <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2">
      <div className="bg-white/10 backdrop-blur-md rounded-full px-4 md:px-6 py-2 md:py-3 border border-white/20">
        <p className="text-white/80 text-xs md:text-sm font-medium">
          💫 드래그해서 <span className="font-bold">기울이기</span> | 왼쪽 더블클릭:{" "}
          <span className="font-bold">이전</span> | 오른쪽 더블클릭: <span className="font-bold">다음</span>
        </p>
      </div>
    </div>
  )
} 