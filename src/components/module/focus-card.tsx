import CardSkew from '../animata/card/card-skew';

const FocusCard = ({ item }: { item: any }) => {
  return (
    <div
      key={item?.id ?? 1}
      className={'absolute left-[50%] top-[20%] z-10 animate-fadeIn'}
      style={{
        transform: 'translateX(-50%) scale(1.1)',
        transition: 'transform 0.5s ease, filter 0.5s ease',
        filter: 'none',
        zIndex: 3,
      }}
    >
      <CardSkew
        heading1={item?.heading1}
        heading2={item?.heading2}
        heading3={item?.heading3}
        verse={item?.verse}
        text={item?.text}
        isFocus={true}
      />
    </div>
  );
};

export default FocusCard;
