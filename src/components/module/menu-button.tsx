'use client';
import StaggeredCard from '../animata/card/staggered-card';

const MenuButton = () => {
  const linkList = Array.from({ length: 14 }, (_, i) => ({
    href: `/dep/${i + 1}`,
    label: `${i + 1}일차`,
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
