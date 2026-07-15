/**
 * 웨딩 SVG 그래픽 (코드로 그린 벡터 라인아트).
 * 사진 이미지 생성기가 없어 SVG로 테마에 맞는 웨딩 모티프를 만든다.
 * 색: 앤티크 골드(#A9843E) 라인 · 샴페인 아이보리 배경.
 */

const GOLD = "#A9843E";
const GOLD2 = "#C6A867";
const GEM = "#B8924A";

function hash(value: string) {
  let h = 0;
  for (const ch of value) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

/** 5장 꽃잎 꽃 한 송이 */
function flower(cx: number, cy: number, r: number) {
  let petals = "";
  for (let a = 0; a < 360; a += 72) {
    const rad = (a * Math.PI) / 180;
    const px = (cx + Math.cos(rad) * r).toFixed(1);
    const py = (cy + Math.sin(rad) * r).toFixed(1);
    petals += `<circle cx="${px}" cy="${py}" r="${(r * 0.62).toFixed(1)}" fill="${GOLD2}"/>`;
  }
  return `${petals}<circle cx="${cx}" cy="${cy}" r="${(r * 0.55).toFixed(1)}" fill="${GOLD}"/>`;
}

// 정사각 썸네일용 모티프 6종 (viewBox 0 0 100 100)
const MOTIFS: string[] = [
  // 반지 두 개 + 보석
  `<circle cx="42" cy="57" r="16" fill="none" stroke="${GOLD}" stroke-width="2.4"/>
   <circle cx="59" cy="57" r="16" fill="none" stroke="${GOLD}" stroke-width="2.4"/>
   <path d="M42 33 l4 -7 4 7 -4 5 z" fill="${GEM}"/>`,
  // 하트
  `<path d="M50 72 C 26 54 32 28 50 42 C 68 28 74 54 50 72 Z" fill="none" stroke="${GOLD}" stroke-width="2.4"/>`,
  // 다이아몬드
  `<path d="M32 46 L44 32 H56 L68 46 L50 72 Z" fill="none" stroke="${GOLD}" stroke-width="2.2" stroke-linejoin="round"/>
   <path d="M32 46 H68 M44 32 L50 46 L56 32 M50 46 L50 72" fill="none" stroke="${GOLD2}" stroke-width="1.2"/>`,
  // 부케
  `${flower(40, 38, 6)}${flower(58, 37, 6)}${flower(49, 50, 6)}
   <path d="M40 44 L49 72 M58 43 L49 72 M49 56 L49 72" fill="none" stroke="${GOLD}" stroke-width="1.6"/>
   <path d="M43 66 H55" stroke="${GEM}" stroke-width="2.2"/>`,
  // 샴페인 잔 두 개
  `<ellipse cx="40" cy="34" rx="6.5" ry="9" fill="none" stroke="${GOLD}" stroke-width="2"/>
   <path d="M40 43 V66 M32 68 H48" fill="none" stroke="${GOLD}" stroke-width="2"/>
   <ellipse cx="60" cy="34" rx="6.5" ry="9" fill="none" stroke="${GOLD}" stroke-width="2"/>
   <path d="M60 43 V66 M52 68 H68" fill="none" stroke="${GOLD}" stroke-width="2"/>`,
  // 웨딩벨
  `<path d="M34 60 Q34 36 47 36 Q60 36 60 60 Z" fill="none" stroke="${GOLD}" stroke-width="2.2"/>
   <circle cx="47" cy="64" r="3" fill="${GEM}"/>
   <path d="M47 36 V30" fill="none" stroke="${GOLD}" stroke-width="2"/>`,
];

/** 박람회마다 다른 정사각 썸네일 (같은 이름이면 항상 같은 모티프) */
export function fairThumb(name: string): string {
  const motif = MOTIFS[hash(name) % MOTIFS.length];

  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name} 아이콘"><rect x="1.5" y="1.5" width="97" height="97" rx="10" fill="#FBF4E8" stroke="#E7D6B2" stroke-width="1.5"/>${motif}</svg>`;
}

/** 작은 잎사귀 한 쌍 */
function leaf(cx: number, cy: number, dir: number) {
  const d = dir;
  return `<path d="M${cx} ${cy} q ${8 * d} -5 ${14 * d} 1 q ${-6 * d} 5 ${-14 * d} -1 z" fill="${GOLD2}" opacity="0.85"/>`;
}

/** 3차 베지어 위의 점 */
function cubic(t: number, p: number[][]) {
  const u = 1 - t;
  const x =
    u * u * u * p[0][0] +
    3 * u * u * t * p[1][0] +
    3 * u * t * t * p[2][0] +
    t * t * t * p[3][0];
  const y =
    u * u * u * p[0][1] +
    3 * u * u * t * p[1][1] +
    3 * u * t * t * p[2][1] +
    t * t * t * p[3][1];
  return [x, y];
}

/** 메인 히어로 배너 — 골드 웨딩 아치에 꽃 갈랜드 + 반지 */
export function heroSvg(): string {
  // 아치 곡선(3차 베지어) 위에 꽃을 뿌려 갈랜드처럼 채운다.
  const arch = [
    [330, 214],
    [330, 44],
    [870, 44],
    [870, 214],
  ];

  const samples = [0.06, 0.15, 0.26, 0.38, 0.62, 0.74, 0.85, 0.94];
  const garland = samples
    .map((t, i) => {
      const [x, y] = cubic(t, arch);
      const r = 8 + (i % 3);
      return `${leaf(x - 6, y + 4, -1)}${leaf(x + 6, y + 4, 1)}${flower(x, y, r)}`;
    })
    .join("");

  const [ax, ay] = cubic(0.5, arch); // 아치 정점

  return `<svg viewBox="0 0 1200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="웨딩박람회 대표 이미지">
  <defs>
    <linearGradient id="wch" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F8F2E7"/>
      <stop offset="1" stop-color="#EFE3D0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="240" fill="url(#wch)"/>
  <rect x="22" y="22" width="1156" height="196" fill="none" stroke="#D9C29A" stroke-width="1"/>
  <path d="M330 214 C 330 44 870 44 870 214" fill="none" stroke="${GOLD}" stroke-width="2.5"/>
  <path d="M348 214 C 348 66 852 66 852 214" fill="none" stroke="${GOLD2}" stroke-width="1" opacity="0.55"/>
  ${garland}
  <circle cx="${(ax - 11).toFixed(1)}" cy="${(ay + 4).toFixed(1)}" r="14" fill="none" stroke="${GOLD}" stroke-width="2.5"/>
  <circle cx="${(ax + 11).toFixed(1)}" cy="${(ay + 4).toFixed(1)}" r="14" fill="none" stroke="${GOLD}" stroke-width="2.5"/>
  <path d="M${ax} ${(ay - 20).toFixed(1)} l5 -9 5 9 -5 6 z" fill="${GEM}"/>
  <path d="M470 214 H730 M540 214 l60 8 60 -8" fill="none" stroke="${GOLD2}" stroke-width="1" opacity="0.5"/>
</svg>`;
}
