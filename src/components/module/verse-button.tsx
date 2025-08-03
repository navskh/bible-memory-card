'use client';
import StaggeredCard from '../animata/card/staggered-card';

const makeLabel = (verse: any) => {
  return `(${verse.verse}) ${verse.heading1.slice(
    0,
    10,
  )}... ${verse.heading2.slice(0, 10)}... ${verse.heading3.slice(0, 10)}...`;
};

const VerseButton = ({
  verseList,
  setInjectedIndex,
}: {
  verseList: any[];
  setInjectedIndex: (index: number) => void;
}) => {
  return (
    <StaggeredCard
      className="absolute top-25 left-12 text-sm"
      title="VERSE 선택"
      links={verseList.map(verse => ({
        index: verse.id,
        href: `/${verse.id}`,
        label: makeLabel(verse),
      }))}
      onClick={e => {
        console.log(e.target);
        if (e.target instanceof HTMLAnchorElement) {
          setInjectedIndex(Number(e.target.dataset.index));
        }
      }}
    />
  );
};

export default VerseButton;
