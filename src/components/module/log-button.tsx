import { useState } from 'react';

const LogButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="absolute bottom-5 left-5 text-xl font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer z-10 bg-zinc-800 px-4 py-2 rounded-md"
      >
        암송내역
      </button>
      {isOpen && (
        <div className="absolute bottom-20 left-5 text-xl font-medium z-10 px-4 py-2 transition-all duration-300 ease-out will-change-transform">
          <p>
            오늘의 암송 횟수는 {localStorage.getItem('todays-count')}회 입니다.
          </p>
        </div>
      )}
    </>
  );
};

export default LogButton;
