'use client';
import { useState } from 'react';
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
    <div className="absolute top-10 right-10 flex flex-wrap items-center justify-center gap-4 rounded-md bg-neutral-950 p-1">
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
        'relative rounded-md p-2 text-sm transition-all',
        selected ? 'text-white' : 'text-slate-300 hover:font-black',
      )}
    >
      <p className="relative z-50 min-w-20">{text}</p>
      {selected && (
        <motion.span
          layoutId="tabs"
          transition={{ type: 'spring', duration: 0.5 }}
          className="absolute inset-0 rounded-sm bg-gradient-to-r from-neutral-600 to-neutral-600"
        />
      )}
    </button>
  );
};
