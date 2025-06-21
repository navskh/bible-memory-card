"use client"

interface ErrorScreenProps {
  message?: string
}

export default function ErrorScreen({ message = "데이터를 불러올 수 없습니다." }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/80">{message}</p>
      </div>
    </div>
  )
} 