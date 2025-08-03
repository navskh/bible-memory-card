module.exports = {
  theme: {
    extend: {
      transitionTimingFunction: {
        'minor-spring': 'cubic-bezier(0.18,0.89,0.82,1.04)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'bg-position': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(80%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'reveal-down': {
          '0%': { opacity: '0', transform: 'translateY(-80%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'content-blur': {
          '0%': { filter: 'blur(0.3rem)' },
          '100%': { filter: 'blur(0)' },
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'], // 기본 sans에 Pretendard 우선 적용
      },
    },
    animation: {
      fadeIn: 'fadeIn 0.5s ease-in',
      'bg-position': 'bg-position 3s infinite alternate',
    },
  },
};
