'use client';
import { useState } from 'react';

const LogButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];

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
          {localStorage.getItem(`${today}-count`) &&
          localStorage.getItem(`${today}-count`) !== '0' ? (
            <p>
              오늘의 암송 횟수는 {localStorage.getItem(`${today}-count`)}회
              입니다.
            </p>
          ) : (
            <p>오늘의 암송 횟수가 없습니다.</p>
          )}
        </div>
      )}
    </>
  );
};

export default LogButton;
