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

  data.verses.forEach((verse: any) => {
    cards.push({
      id: verse.id,
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
};
