'use client';
import CardSkew from '../animata/card/card-skew';

const BlurCard = ({ item, index }: { item: any; index: number }) => {
  return (
    <div
      key={item.id ?? index}
      className={'absolute left-[50%] top-[20%] z-10 animate-fadeIn'}
      style={{
        transform:
          index === 0
            ? 'translateX(-150%) rotate(-20deg)'
            : 'translateX(50%) rotate(20deg)',
        transition: 'transform 0.5s ease, filter 0.5s ease',
        filter: 'blur(4px)',
        zIndex: 1,
      }}
    >
      <CardSkew
        heading1={item.heading1}
        heading2={item.heading2}
        heading3={item.heading3}
        verse={item.verse}
        text={item.text}
        isFocus={false}
      />
    </div>
  );
};

export default BlurCard;
