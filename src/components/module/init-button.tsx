const InitButton = () => {
  return (
    <button
      onClick={() => {
        if (confirm('모든 데이터를 초기화하시겠습니까?')) {
          localStorage.clear();
          window.location.reload();
        }
      }}
      className="absolute bottom-5 right-5 text-xl font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer z-10 bg-zinc-800 px-4 py-2 rounded-md"
    >
      초기화
    </button>
  );
};

export default InitButton;
