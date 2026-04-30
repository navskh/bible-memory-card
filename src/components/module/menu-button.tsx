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
      className="absolute bottom-20 right-5 text-xl"
      title="PART 선택"
      direction="up"
      align="right"
      links={linkList}
    />
  );
};

export default MenuButton;
