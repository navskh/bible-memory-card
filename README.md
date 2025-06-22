# 성경 암송 앱 (Bible Memory App)

성경 구절을 효과적으로 암송할 수 있는 Progressive Web App (PWA)입니다.

## 주요 기능

- 📖 **성경 구절 암송**: DEP242 성경 구절들을 카드 형태로 제공
- 👁️ **구절 숨김/보이기**: 클릭하여 구절을 가렸다가 확인할 수 있는 인터랙티브 기능
- ✅ **진행 상황 추적**: 체크 표시로 암송 완료한 구절을 표시
- 💾 **자동 저장**: localStorage를 통한 진행 상황 자동 저장
- 📱 **PWA 지원**: 홈 화면에 설치 가능한 PWA 앱
- 🎨 **3D 인터랙션**: 마우스/터치로 카드를 회전시킬 수 있는 3D 효과

## PWA 기능

이 앱은 PWA(Progressive Web App)로 제작되어 다음과 같은 기능을 제공합니다:

- **홈 화면 설치**: 브라우저에서 "앱 설치" 버튼을 통해 홈 화면에 추가 가능
- **오프라인 지원**: Service Worker를 통한 캐싱으로 오프라인에서도 사용 가능
- **네이티브 앱 경험**: 독립적인 창에서 실행되며 네이티브 앱과 유사한 경험 제공

## 시작하기

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
# 또는
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### PWA 설치

1. 브라우저에서 앱을 열고 잠시 기다립니다
2. 브라우저 주소창 옆에 나타나는 "설치" 버튼을 클릭하거나
3. 브라우저 메뉴에서 "앱 설치" 옵션을 선택합니다

## 기술 스택

- **프레임워크**: Next.js 15
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **아이콘**: Lucide React
- **PWA**: Service Worker, Web App Manifest

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
├── components/             # React 컴포넌트
│   ├── elements/          # 주요 UI 요소들
│   └── ui/               # 기본 UI 컴포넌트
├── hooks/                 # 커스텀 React 훅
├── lib/                   # 유틸리티 함수들
├── types/                 # TypeScript 타입 정의
└── assets/               # 정적 데이터 (JSON 파일들)
```

## 배포

### Vercel 배포

가장 쉬운 방법은 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)을 사용하는 것입니다.

### 다른 플랫폼

```bash
npm run build
npm run start
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
