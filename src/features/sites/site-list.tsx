"use client";

import { useEffect, useState } from "react";

type Site = {
  name: string;
};

export default function SiteList() {
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    fetch("/api/sites")
      .then((r) => r.json())
      .then(setSites);
  }, []);

  return (
    <section className="rounded-3xl border border-white/10 bg-[#071020] p-6">
      <h2 className="mb-6 text-2xl font-bold">
        생성된 사이트
      </h2>

      <div className="space-y-4">
        {sites.map((site) => (
          <div
            key={site.name}
            className="flex items-center justify-between rounded-2xl bg-slate-900 p-5"
          >
            <div>
              <p className="font-bold">
                {site.name}
              </p>

              <p className="text-sm text-slate-400">
                generated-sites/{site.name}
              </p>
            </div>

            <div className="flex gap-3">
              <button className="rounded-xl bg-blue-600 px-4 py-2">
                미리보기
              </button>

              <button className="rounded-xl bg-emerald-600 px-4 py-2">
                GitHub
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}