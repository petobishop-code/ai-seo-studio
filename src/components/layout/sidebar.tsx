const menuItems = [
  "대시보드",
  "프로젝트",
  "웹사이트",
  "AI 팀",
  "분석",
  "설정",
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6">
      <h1 className="text-xl font-bold">AI SEO 스튜디오</h1>

      <p className="mt-2 text-sm text-slate-400">
        웹사이트 상위노출 운영 플랫폼
      </p>

      <nav className="mt-10 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item}
            className={`w-full rounded-lg px-4 py-3 text-left text-sm ${
              item === "프로젝트"
                ? "bg-white text-slate-950"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="mt-10 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
        <p className="font-semibold text-slate-200">CEO 모드</p>
        <p className="mt-1">내부 운영용</p>
      </div>
    </aside>
  );
}