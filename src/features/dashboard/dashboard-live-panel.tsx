const activities = [
  { time: "09:42", ai: "글쓰는 AI", task: "성산구하수구막힘 원고 작성 완료", status: "완료" },
  { time: "09:38", ai: "검색엔진 AI", task: "네이버 색인 요청 14건 진행", status: "진행중" },
  { time: "09:31", ai: "발행하는 AI", task: "오후 3시 예약발행 대기", status: "대기" },
  { time: "09:18", ai: "분석하는 AI", task: "방문자 흐름 +13% 상승 감지", status: "분석" },
];

const missions = [
  "창원하수구막힘 지역 페이지 5개 작성",
  "수리남케어 내부링크 구조 점검",
  "네이버 색인 누락 페이지 확인",
];

export default function DashboardLivePanel() {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-[#0d1628]/90 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-300">LIVE ACTIVITY</p>
            <h2 className="mt-1 text-2xl font-bold">AI 실시간 활동</h2>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
            Live
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {activities.map((item) => (
            <div
              key={`${item.time}-${item.task}`}
              className="rounded-2xl border border-white/10 bg-[#071020] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500">{item.time}</p>
                  <p className="mt-1 font-bold">{item.ai}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.task}</p>
                </div>

                <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-300">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-[#0d1628]/90 p-6 shadow-xl">
          <p className="text-sm text-violet-300">TODAY MISSION</p>
          <h2 className="mt-1 text-2xl font-bold">오늘의 미션</h2>

          <div className="mt-5 space-y-3">
            {missions.map((mission) => (
              <div
                key={mission}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300"
              >
                □ {mission}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/15 to-violet-500/10 p-6 shadow-xl">
          <p className="text-sm text-blue-300">AI INSIGHT</p>
          <h2 className="mt-1 text-2xl font-bold">마스터 인사이트</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            현재 하수구/배관 키워드는 지역 페이지 확장이 가장 빠른 성장 전략입니다.
            오늘은 창원·성산구·의창구 중심으로 콘텐츠를 늘리는 것이 좋습니다.
          </p>
        </div>
      </div>
    </section>
  );
}