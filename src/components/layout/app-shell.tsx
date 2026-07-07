import Sidebar from "@/components/layout/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex flex-1 flex-col">
          <header className="flex h-20 items-center justify-between border-b border-white/10 px-8">
            <div>
              <p className="text-sm text-slate-400">Good Morning, 성우님 👋</p>
              <h1 className="text-2xl font-bold">
                AI 직원들이 오늘도 열심히 일하고 있어요!
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <input
                placeholder="검색 (프로젝트, 키워드, 페이지...)"
                className="w-80 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400/50"
              />
              <div className="rounded-full bg-white/[0.06] px-4 py-2 text-sm">
                petobishop
              </div>
            </div>
          </header>

          <div className="flex-1 p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}