import ProjectForm from "./project-form";

export default function ProjectPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-transparent p-8 shadow-2xl shadow-blue-950/30">
        <p className="text-sm text-blue-300">AI CONTROL CENTER · LIVE</p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight">
          AI 직원 운영 대시보드
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          프로젝트를 등록하면 글쓰는 AI, 검색엔진 AI, 발행하는 AI, 분석하는 AI가
          자동으로 연결되어 웹사이트 상위노출 작업을 운영합니다.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatusCard title="글쓰는 AI" status="작성 중" value="67%" />
          <StatusCard title="검색엔진 AI" status="색인 요청 중" value="92%" />
          <StatusCard title="발행하는 AI" status="예약 대기" value="65%" />
          <StatusCard title="분석하는 AI" status="데이터 분석 중" value="89%" />
        </div>
      </section>

      <ProjectForm />
    </div>
  );
}

function StatusCard({
  title,
  status,
  value,
}: {
  title: string;
  status: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1628]/80 p-5">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{status}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-2 flex-1 rounded-full bg-slate-800">
          <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
        </div>
        <span className="ml-3 text-sm text-blue-300">{value}</span>
      </div>
    </div>
  );
}