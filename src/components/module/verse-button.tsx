'use client';
import { BookOpen } from 'lucide-react';
import StaggeredCard from '../animata/card/staggered-card';

const truncate = (s: string | undefined, n: number) => {
  if (!s) return '';
  return s.length > n ? `${s.slice(0, n)}…` : s;
};

const makeLabel = (verse: any) => {
  const parts = [verse.heading1, verse.heading2, verse.heading3]
    .filter(Boolean)
    .map(p => truncate(p, 14));
  return parts.join(' · ');
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
      className="absolute bottom-20 left-5"
      title="VERSE"
      icon={<BookOpen className="size-4" strokeWidth={2.5} />}
      direction="up"
      links={verseList.map(verse => ({
        index: verse.id,
        href: `/${verse.id}`,
        label: makeLabel(verse),
        sublabel: verse.verse,
      }))}
      onClick={e => {
        if (e.target instanceof HTMLElement) {
          const anchor = e.target.closest('a');
          if (anchor instanceof HTMLAnchorElement && anchor.dataset.index) {
            setInjectedIndex(Number(anchor.dataset.index));
          }
        }
      }}
    />
  );
};

export default VerseButton;
