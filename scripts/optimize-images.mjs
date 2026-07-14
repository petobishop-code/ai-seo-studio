/**
 * 원본 사진(PNG)을 웹용 WebP로 변환한다.
 * 원본은 건드리지 않고 site-assets/ 아래에 변환본만 만든다.
 *
 * 실행: node scripts/optimize-images.mjs
 *
 * ─────────────────────────────────────────────────────────────
 * 배너는 브랜드 전용입니다.
 * 배너 이미지에 전화번호가 그림으로 박혀 있어서, 다른 브랜드가 쓰면
 * 남의 전화번호가 노출됩니다. 그래서 배너는 brands/{brandSlug}/banner 로만 들어갑니다.
 * 작업사진은 번호가 없어 업종 공용(industries/{업종}/gallery)으로 둡니다.
 *
 * 새 브랜드를 추가할 때: 아래 JOBS 에 배너 항목을 하나 추가하세요.
 * ─────────────────────────────────────────────────────────────
 */
import { mkdir, readdir, stat } from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();

const JOBS = [
  {
    label: "banner",
    from: "하수구 배너 사진",
    to: "site-assets/brands/surinam/banner", // ← 수리남케어 전용 (전화번호 010-7601-1156 박힘)
    width: 1600,
    quality: 82,
  },
  {
    label: "gallery",
    from: "하수구 사진",
    to: "site-assets/industries/drain/gallery", // ← 하수구 업종 공용
    width: 900,
    quality: 80,
  },
];

/** 1.png, 10.png 이 1,2,3... 순으로 정렬되도록 숫자 기준 정렬 */
function naturalSort(a, b) {
  const na = parseInt(a.match(/\d+/)?.[0] ?? "0", 10);
  const nb = parseInt(b.match(/\d+/)?.[0] ?? "0", 10);
  return na - nb || a.localeCompare(b);
}

async function dirSize(dir) {
  const files = await readdir(dir);
  let total = 0;

  for (const file of files) {
    const info = await stat(path.join(dir, file));
    total += info.size;
  }

  return total;
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2);

for (const job of JOBS) {
  const from = path.join(ROOT, job.from);
  const to = path.join(ROOT, job.to);

  await mkdir(to, { recursive: true });

  const files = (await readdir(from))
    .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
    .sort(naturalSort);

  const beforeBytes = await dirSize(from);

  let index = 0;

  for (const file of files) {
    index += 1;
    const name = `${job.label}-${String(index).padStart(2, "0")}.webp`;

    await sharp(path.join(from, file))
      .resize({ width: job.width, withoutEnlargement: true })
      .webp({ quality: job.quality })
      .toFile(path.join(to, name));
  }

  const afterBytes = await dirSize(to);
  const saved = (100 - (afterBytes / beforeBytes) * 100).toFixed(1);

  console.log(
    `${job.label.padEnd(8)} ${String(files.length).padStart(2)}개  ` +
      `${mb(beforeBytes).padStart(6)}MB → ${mb(afterBytes).padStart(6)}MB  (-${saved}%)  ${job.to}`
  );
}
