"use client";

import { motion } from "motion/react";

const workers = [
  {
    name: "글쓰는 AI",
    label: "Writer AI",
    task: "성산구 페이지 작성중",
    progress: "67%",
    position: "left-1/2 top-4 -translate-x-1/2",
    glow: "from-blue-400 to-violet-500",
  },
  {
    name: "검색엔진 AI",
    label: "SEO AI",
    task: "네이버 색인 요청",
    progress: "92%",
    position: "left-6 top-1/2 -translate-y-1/2",
    glow: "from-emerald-400 to-blue-500",
  },
  {
    name: "발행하는 AI",
    label: "Publish AI",
    task: "오후 3시 예약발행",
    progress: "65%",
    position: "right-6 top-1/2 -translate-y-1/2",
    glow: "from-orange-400 to-violet-500",
  },
  {
    name: "분석하는 AI",
    label: "Analytics AI",
    task: "방문자 흐름 분석중",
    progress: "89%",
    position: "bottom-6 left-24",
    glow: "from-cyan-400 to-blue-500",
  },
  {
    name: "관리하는 AI",
    label: "Manager AI",
    task: "작업 우선순위 정리",
    progress: "74%",
    position: "bottom-6 right-24",
    glow: "from-teal-400 to-violet-500",
  },
];

export default function AIControlCenter() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#071020] p-8 shadow-2xl shadow-blue-950/40">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.26),transparent_46%)]"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-300">
            AI CONTROL CENTER · LIVE
          </p>
          <h2 className="mt-2 text-3xl font-bold">AI 직원 운영 센터</h2>
          <p className="mt-2 text-sm text-slate-400">
            AI 직원들이 실시간으로 글쓰기, SEO, 발행, 분석 작업을 진행합니다.
          </p>
        </div>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
          5명 근무중
        </div>
      </div>

      <div className="relative z-10 h-[520px]">
        <motion.div
          className="absolute left-1/2 top-1/2 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-blue-300/30 bg-gradient-to-br from-blue-500/30 to-violet-600/30 shadow-2xl shadow-blue-500/30"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 40px rgba(59,130,246,0.25)",
              "0 0 80px rgba(139,92,246,0.45)",
              "0 0 40px rgba(59,130,246,0.25)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="text-5xl"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ✦
          </motion.div>
          <p className="mt-3 text-xl font-bold">AI Core</p>
          <p className="mt-1 text-xs text-blue-200">SEO OS</p>
        </motion.div>

        {workers.map((worker, index) => (
          <motion.div
            key={worker.name}
            className={`absolute ${worker.position} w-56 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl backdrop-blur-xl`}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
            transition={{
              opacity: { duration: 0.5, delay: index * 0.1 },
              y: { duration: 4 + index * 0.3, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.5 },
            }}
          >
            <div
              className={`absolute -inset-px rounded-3xl bg-gradient-to-r ${worker.glow} opacity-20 blur-xl`}
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{worker.name}</p>
                  <p className="text-xs text-slate-400">{worker.label}</p>
                </div>
                <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
              </div>

              <p className="mt-4 text-sm text-slate-300">{worker.task}</p>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-slate-800">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${worker.glow}`}
                    initial={{ width: "20%" }}
                    animate={{ width: worker.progress }}
                    transition={{ duration: 1.2, delay: index * 0.15 }}
                  />
                </div>
                <span className="text-xs text-blue-300">{worker.progress}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}