'use client';
import { Layers } from 'lucide-react';
import StaggeredCard from '../animata/card/staggered-card';
import { getDepTitle } from '@/lib/load-data';

const MenuButton = () => {
  const linkList = getDepTitle().map((title, index) => ({
    href: `/dep/${index + 1}`,
    label: title,
    sublabel: `PART ${index + 1}`,
  }));

  return (
    <StaggeredCard
      className="absolute bottom-20 right-5"
      title="PART"
      icon={<Layers className="size-4" strokeWidth={2.5} />}
      direction="up"
      align="right"
      links={linkList}
    />
  );
};

export default MenuButton;
