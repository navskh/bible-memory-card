"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download, Info, AlertCircle } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [pwaConditions, setPwaConditions] = useState({
    hasManifest: false,
    hasServiceWorker: false,
    isHttps: false,
    isStandalone: false,
    hasBeforeInstallPrompt: false,
    hasIcons: false
  })

  const checkPWAConditions = () => {
    const manifestLink = document.querySelector('link[rel="manifest"]')
    const hasManifest = !!manifestLink
    
    // 아이콘 확인
    const hasIcons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').length > 0
    
    const conditions = {
      hasManifest,
      hasServiceWorker: 'serviceWorker' in navigator,
      isHttps: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      hasBeforeInstallPrompt: false,
      hasIcons
    }
    
    setPwaConditions(conditions)
    console.log('PWA 조건 확인:', conditions)
    
    // 디버깅을 위해 더 자세한 정보 출력
    if (manifestLink) {
      console.log('Manifest URL:', manifestLink.getAttribute('href'))
    }
    
    // Service Worker 등록 상태 확인
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('등록된 Service Worker:', registrations.length)
      })
    }
  }

  useEffect(() => {
    // 페이지 로드 후 약간의 지연을 두고 확인
    setTimeout(checkPWAConditions, 1000)

    const handler = (e: Event) => {
      console.log('beforeinstallprompt 이벤트 발생!')
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
      setPwaConditions(prev => ({ ...prev, hasBeforeInstallPrompt: true }))
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('deferredPrompt가 없습니다.')
      return
    }

    console.log('설치 프롬프트 실행...')
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('PWA 설치가 수락되었습니다.')
    } else {
      console.log('PWA 설치가 거부되었습니다.')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  // PWA 설치 프롬프트가 나타났을 때
  if (showInstallPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              앱 설치하기
            </h3>
            <p className="text-xs text-gray-600">
              홈 화면에 추가하여 더 빠르게 접근하세요
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            설치
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
          >
            나중에
          </Button>
        </div>
      </div>
    )
  }

  // PWA 상태 디버깅 정보 (기본적으로 숨김, 토글 가능)
  if (!pwaConditions.isStandalone && showDebugInfo) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-blue-50 rounded-lg border border-blue-200 p-4 z-50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              PWA 상태
            </h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div>Manifest: {pwaConditions.hasManifest ? '✅' : '❌'}</div>
              <div>Service Worker: {pwaConditions.hasServiceWorker ? '✅' : '❌'}</div>
              <div>HTTPS: {pwaConditions.isHttps ? '✅' : '❌'}</div>
              <div>Standalone: {pwaConditions.isStandalone ? '✅' : '❌'}</div>
              <div>Icons: {pwaConditions.hasIcons ? '✅' : '❌'}</div>
              <div>Install Prompt: {pwaConditions.hasBeforeInstallPrompt ? '✅' : '❌'}</div>
            </div>
            
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              PWA 설치 프롬프트가 나타나지 않는 이유:
              <ul className="mt-1 ml-4 list-disc">
                <li>이미 PWA로 설치되어 있음</li>
                <li>브라우저가 아직 조건을 만족하지 않음</li>
                <li>충분한 상호작용이 없음</li>
              </ul>
            </div>

            {/* iOS 사용자를 위한 특별 안내 */}
            {isIOS && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                <div className="font-semibold mb-1">📱 iOS 사용자를 위한 설치 방법:</div>
                <ol className="ml-4 list-decimal space-y-1">
                  <li>Safari 브라우저에서 이 페이지를 열어주세요</li>
                  <li>하단 공유 버튼(네모 박스에 화살표)을 클릭하세요</li>
                  <li>&quot;홈 화면에 추가&quot;를 선택하세요</li>
                  <li>&quot;추가&quot; 버튼을 클릭하세요</li>
                </ol>
                {!isSafari && (
                  <div className="mt-2 p-1 bg-orange-50 border border-orange-200 rounded">
                    ⚠️ 현재 Safari가 아닌 브라우저를 사용 중입니다. Safari로 전환해주세요.
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowDebugInfo(false)}
            className="text-blue-400 hover:text-blue-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => {
              // 수동으로 설치 프롬프트 트리거 시도
              if (deferredPrompt) {
                handleInstallClick()
              } else {
                if (isIOS) {
                  alert('iOS에서는 Safari 브라우저의 공유 버튼을 통해 설치해주세요.')
                } else {
                  alert('설치 프롬프트가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.')
                }
              }
            }}
            size="sm"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={!deferredPrompt && !isIOS}
          >
            <Download className="w-4 h-4 mr-2" />
            {isIOS ? 'iOS 설치 안내' : '수동 설치'}
          </Button>
        </div>
      </div>
    )
  }

  // PWA 상태 토글 버튼 (작은 버튼)
  if (!pwaConditions.isStandalone && !showDebugInfo) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDebugInfo(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
          title="PWA 상태 확인"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return null
} 