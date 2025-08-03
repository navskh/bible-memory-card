'use client';
interface DotProps {
  color?: string;
  size?: number;
  spacing?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Dot({
  color = '#cacaca',
  size = 1,
  spacing = 10,
  children,
  className,
  style = {
    backgroundColor: 'white',
  },
}: DotProps) {
  return (
    <div
      style={{
        ...style,
        backgroundImage: `radial-gradient(${color} ${size}px, transparent ${size}px)`,
        backgroundSize: `calc(${spacing} * ${size}px) calc(${spacing} * ${size}px)`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
