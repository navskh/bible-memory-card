'use client';
import Dot from '@/components/animata/background/dot';
import MyCarousel from '@/components/animata/carousel/my-carousel';
import TypingText from '@/components/animata/text/type-text';
import MenuButton from '@/components/module/menu-button';
import { useEffect, useState } from 'react';
import NewLoadingScreen from '@/components/module/loading-screen';
import {
  convert60VerseToBibleCards,
  convertDepDataToBibleCards,
  load60Verse,
  loadDepByDate,
} from '@/lib/load-data';
import VerseButton from '../module/verse-button';
import NavTabs from '../animata/container/nav-tabs';
import InitButton from '../module/init-button';
import LogButton from '../module/log-button';

export default function BibleMemorySeries({ day }: { day: string }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [cards, setCards] = useState<any[]>([]);
  const [injectedIndex, setInjectedIndex] = useState(0);
  const [mode, setMode] = useState<'60구절' | 'DEP 242'>('60구절');

  useEffect(() => {
    const storageInjectedIndex = localStorage.getItem('injectedIndex');
    if (storageInjectedIndex) {
      setInjectedIndex(parseInt(storageInjectedIndex) || 0);
    }
    const storageMode = localStorage.getItem('mode') as '60구절' | 'DEP 242';
    if (storageMode) {
      setMode(storageMode);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (mode === 'DEP 242') {
          const depData = await loadDepByDate(day);
          setTitle(depData.title);
          const cards = convertDepDataToBibleCards(depData);
          setCards(cards);
        } else {
          const bibleData = await load60Verse();
          const cards = convert60VerseToBibleCards(bibleData);
          setTitle('60구절');
          setCards(cards);
        }
      } catch (error) {
        console.error(`Failed to load data:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [day, mode]);

  if (loading) {
    return <NewLoadingScreen />;
  }
  return (
    <Dot className="font-sans h-screen w-screen max-w-full mx-auto flex h-screen items-center justify-center">
      <TypingText
        className="absolute top-5 left-10 text-xl font-medium"
        alwaysVisibleCount={0}
        repeat={false}
        delay={50}
        smooth
        text={`${title}`}
        waitTime={5000}
      />
      <NavTabs
        tabs={['60구절', 'DEP 242']}
        selected={mode}
        onSelect={tab => {
          localStorage.setItem('mode', tab);
          setMode(tab as '60구절' | 'DEP 242');
        }}
      />
      {mode === '60구절' && (
        <VerseButton verseList={cards} setInjectedIndex={setInjectedIndex} />
      )}
      {mode === 'DEP 242' && (
        <>
          <MenuButton />
          <VerseButton verseList={cards} setInjectedIndex={setInjectedIndex} />
        </>
      )}

      {cards.length > 0 && (
        <MyCarousel
          items={cards}
          injectedIndex={injectedIndex}
          setInjectedIndex={setInjectedIndex}
        />
      )}

      <InitButton />
      <LogButton />
    </Dot>
  );
}
