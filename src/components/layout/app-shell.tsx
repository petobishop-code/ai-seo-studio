import Sidebar from "@/components/layout/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-slate-800 px-8">
            <div>
              <p className="text-sm text-slate-400">내부 운영 플랫폼</p>
              <h1 className="text-lg font-semibold">프로젝트 관리</h1>
            </div>

            <div className="rounded-full bg-slate-800 px-4 py-2 text-sm">
              petobishop
            </div>
          </header>

          <div className="flex-1 p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}