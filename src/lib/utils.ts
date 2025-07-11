import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 60구절 JSON 파일을 불러오는 함수
export async function load60VerseData() {
  try {
    const jsonModule = await import('@/assets/60verse/60verse.json');
    return jsonModule.default;
  } catch (error) {
    console.error('Failed to load 60verse.json:', error);
    throw error;
  }
}

// 60구절 데이터를 카드 형식으로 변환하는 함수
export function transform60VerseToBibleCards(verseData: any) {
  const cards: Array<{
    id: string;
    day: number;
    mainTitle: string;
    subTitle: string;
    subSubTitle: string;
    reference: string;
    verse: string;
    originalIndex: number;
  }> = [];

  verseData.verses.forEach((verse: any, index: number) => {
    // 카테고리별로 그룹화하여 day 번호 할당
    const categoryOrder = { A: 1, B: 2, C: 3, D: 4, E: 5 };
    const categoryId = verse.id.split('-')[0];
    const day = categoryOrder[categoryId as keyof typeof categoryOrder] || 1;

    cards.push({
      id: verse.id,
      day: day,
      mainTitle: verse.category,
      subTitle: verse.subcategory,
      subSubTitle: verse.reference,
      reference: verse.reference,
      verse: verse.content,
      originalIndex: index,
    });
  });

  return cards;
}

// DEP242 JSON 파일들을 동적으로 불러오는 함수
export async function loadDEP242Data() {
  const days = Array.from({ length: 14 }, (_, i) => i + 1);
  const data: Array<{
    day: number;
    title: string;
    content: Array<Record<string, string>>;
  }> = [];

  for (const day of days) {
    try {
      const jsonModule = await import(`@/assets/dep242/DEP${day}일차.json`);
      data.push({
        day,
        ...jsonModule.default,
      });
    } catch (error) {
      console.error(`Failed to load DEP${day}일차.json:`, error);
    }
  }

  // 날짜순으로 정렬
  return data.sort((a, b) => a.day - b.day);
}

// 성경 구절 데이터를 카드 형식으로 변환하는 함수
export function transformToBibleCards(
  depData: Array<{
    day: number;
    title: string;
    content: Array<Record<string, string>>;
  }>,
) {
  const cards: Array<{
    id: string;
    day: number;
    mainTitle: string;
    subTitle: string;
    subSubTitle: string;
    reference: string;
    verse: string;
    originalIndex: number;
  }> = [];

  depData.forEach(dayData => {
    dayData.content.forEach((item: Record<string, string>, index: number) => {
      cards.push({
        id: `${dayData.day}-${index + 1}`,
        day: dayData.day,
        mainTitle: dayData.title,
        subTitle: item.대제목,
        subSubTitle: item.중제목 || '',
        reference: item.verse,
        verse: item.text,
        originalIndex: index,
      });
    });
  });

  return cards;
}
