const menuItems = [
  { label: "홈 / Home", active: true },
  { label: "회사 / Company" },
  { label: "웹사이트 / Websites" },
  { label: "AI 팀 / AI Team" },
  { label: "콘텐츠 / Content", count: 12 },
  { label: "발행 / Publish", count: 9 },
  { label: "SEO / SEO" },
  { label: "분석 / Analytics" },
  { label: "보고서 / Reports" },
  { label: "설정 / Settings" },
];

export default function Sidebar() {
  return (
    <aside className="flex w-72 flex-col border-r border-white/10 bg-[#08111f]/95 p-5">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
            ✦
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AI SEO Studio</h1>
            <p className="text-xs text-slate-400">AI SEO Operating System</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
              item.active
                ? "bg-gradient-to-r from-blue-600/40 to-violet-600/40 text-white ring-1 ring-blue-400/40 shadow-lg shadow-blue-500/20"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span>{item.label}</span>
            {item.count ? (
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300">
                {item.count}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-white">Enterprise Plan</p>
          <p className="mt-1 text-xs text-slate-400">만료일 2026.12.31</p>
          <div className="mt-3 h-2 rounded-full bg-slate-800">
            <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-bold">성우님 👑</p>
          <p className="text-xs text-slate-400">CEO</p>
        </div>
      </div>
    </aside>
  );
}