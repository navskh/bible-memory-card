const loadDepByDate = async (date: string) => {
  try {
    const data = await import(`@/assets/dep242/DEP${date}일차.json`);
    return data;
  } catch (_) {
    console.log(`Failed to load DEP${date}일차.json`);
    console.log(_);
    return null;
  }
};

const getDepTitle = () => {
  return [
    '1일차 (Ⅰ.구원의 확신)',
    '2일차 (Ⅱ.Quiet Time)',
    '3일차 (Ⅱ.Quiet Time, Ⅲ.말씀)',
    '4일차 (Ⅲ.말씀)',
    '5일차 (Ⅲ.말씀,Ⅳ.기도)',
    '6일차 (Ⅳ.기도)',
    '7일차 (Ⅳ.기도, Ⅴ.교제)',
    '8일차 (Ⅴ.교제)',
    '9일차 (Ⅴ.교제, Ⅵ.증거)',
    '10일차 (Ⅵ.증거)',
    '11일차 (Ⅵ.증거)',
    '12일차 (Ⅵ.증거, Ⅶ.주재권)',
    '13일차 (Ⅶ.주재권)',
    '14일차 (Ⅷ.세계비전)',
  ];
};

const load60Verse = async () => {
  try {
    const data = await import(`@/assets/60verse/60verse.json`);
    return data;
  } catch (_) {
    console.log(`Failed to load 60verse.json`);
    console.log(_);
    return null;
  }
};

type DEP_JSON_TYPE = {
  text: string;
  verse: string;
  대제목: string;
  소제목: string;
  중제목: string;
};

const convertDepDataToBibleCards = (data: any) => {
  const cards: Array<{
    id: string;
    heading1: string;
    heading2: string;
    heading3: string;
    verse: string;
    text: string;
  }> = [];

  data.content.forEach((item: DEP_JSON_TYPE, index: number) => {
    cards.push({
      id: index.toString(),
      heading1: item.대제목,
      heading2: item.소제목,
      heading3: item.중제목,
      verse: item.verse,
      text: item.text,
    });
  });

  return cards;
};

const convert60VerseToBibleCards = (data: any) => {
  const cards: Array<{
    id: string;
    heading1: string;
    heading2: string;
    heading3: string;
    verse: string;
    text: string;
  }> = [];

  data.verses.forEach((verse: any, index: number) => {
    cards.push({
      id: index.toString(),
      heading1: verse.id,
      heading2: verse.category,
      heading3: verse.subcategory,
      verse: verse.reference,
      text: verse.content,
    });
  });

  return cards;
};

export {
  loadDepByDate,
  convertDepDataToBibleCards,
  load60Verse,
  convert60VerseToBibleCards,
  getDepTitle,
};
