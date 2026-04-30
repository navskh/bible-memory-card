'use client';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface TabProps {
  text: string;
  selected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

export default function NavTabs({
  tabs,
  onSelect,
  selected,
}: {
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
}) {
  return (
    <div className="absolute top-14 left-5 z-30 flex flex-wrap items-center gap-1 rounded-full border border-zinc-200 bg-white/90 p-1 shadow-md shadow-zinc-900/5 backdrop-blur sm:top-15 sm:left-12">
      {tabs.map(tab => (
        <Tab
          text={tab}
          selected={selected === tab}
          setSelected={() => {
            onSelect(tab);
          }}
          key={tab}
        />
      ))}
    </div>
  );
}

const Tab = ({ text, selected, setSelected }: TabProps) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={cn(
        'relative cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
        selected
          ? 'text-amber-700'
          : 'text-zinc-500 hover:text-zinc-800',
      )}
    >
      <span className="relative z-10 tracking-tight">{text}</span>
      {selected && (
        <motion.span
          layoutId="tabs"
          transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
          className="absolute inset-0 rounded-full bg-amber-50 ring-1 ring-amber-200"
        />
      )}
    </button>
  );
};
