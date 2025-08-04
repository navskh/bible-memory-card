'use client';
import StaggeredCard from '../animata/card/staggered-card';
import { getDepTitle } from '@/lib/load-data';

const MenuButton = () => {
  const linkList = getDepTitle().map((title, index) => ({
    href: `/dep/${index + 1}`,
    label: title,
  }));

  return (
    <StaggeredCard
      className="absolute top-30 left-42 text-xl"
      title="PART 선택"
      links={linkList}
    />
  );
};

export default MenuButton;
