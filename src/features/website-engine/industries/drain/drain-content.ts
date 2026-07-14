import type { SiteManifest, SitePageMeta } from "../../types";
import { galleryPath, pickGallery } from "../../layout";

/**
 * 업종(하수구/싱크대/변기)별 원고 소스.
 * surinamcare.kr 형태의 "소제목 + 키포인트 + 단계 + 인용구" 원고를 만들기 위한 데이터.
 */
type ServiceProfile = {
  /** 섹션 1: 발생 원인 키포인트 */
  causes: string[];
  /** 섹션 3: 증상 키포인트 */
  symptoms: string[];
  /** 섹션 6: 심화 설명 제목 */
  deepTitle: string;
  /** 섹션 6: 심화 설명 본문 */
  deepBody: string;
  /** 섹션 8: 예방 관리 키포인트 */
  prevention: string[];
  /** 인용구(현장 코멘트) */
  quote: string;
};

const PROFILES: Record<string, ServiceProfile> = {
  하수구막힘: {
    causes: [
      "음식물 찌꺼기와 이물질 누적",
      "기름때 고착으로 인한 관 내부 협착",
      "배관 내부 슬러지·스케일 발생",
      "노후 배관의 구배 불량",
    ],
    symptoms: [
      "배수 속도가 눈에 띄게 느려짐",
      "물이 역류하거나 고이는 증상",
      "배수구에서 올라오는 악취",
      "여러 배수구에서 동시에 발생하는 막힘",
    ],
    deepTitle: "슬러지와 기름때 제거가 중요한 이유",
    deepBody:
      "하수구 막힘의 상당수는 눈에 보이지 않는 관 내부 슬러지와 기름때에서 시작됩니다. 표면의 이물질만 걷어내면 잠시 뚫린 것처럼 보여도, 관 벽에 고착된 층을 제거하지 않으면 짧은 기간 안에 같은 문제가 반복됩니다. 그래서 단순 관통 작업이 아니라 관 내부 상태를 확인한 뒤 원인 층까지 함께 제거하는 접근이 필요합니다.",
    prevention: [
      "거름망을 설치해 이물질 유입 차단",
      "기름은 하수구에 직접 버리지 않기",
      "주기적으로 뜨거운 물로 관 내부 세척",
      "이상 증상 초기에 점검 받기",
    ],
    quote:
      "\"막힘은 갑자기 생긴 것 같아도, 대부분 관 안에서 서서히 쌓여온 결과입니다.\"",
  },
  싱크대막힘: {
    causes: [
      "음식물 찌꺼기 누적",
      "기름때 고착",
      "세제 찌꺼기 축적",
      "배관 내부 슬러지 발생",
    ],
    symptoms: [
      "물 빠짐이 급격히 느려짐",
      "하부장 배관 연결부 누수",
      "싱크볼에 물이 고이는 역류",
      "주방에서 올라오는 하수 냄새",
    ],
    deepTitle: "기름때와 음식물 찌꺼기 제거가 중요한 이유",
    deepBody:
      "싱크대 막힘의 핵심 원인은 기름때와 음식물 찌꺼기의 결합입니다. 뜨거울 때는 흘러가던 기름이 관 내부에서 식으면서 굳고, 그 위에 음식물 찌꺼기가 달라붙어 딱딱한 층을 형성합니다. 이 층을 그대로 두고 물만 내려 보내면 통로가 점점 좁아져 결국 완전히 막히게 됩니다. 표면 이물질이 아닌 관 벽의 고착층까지 제거해야 재발을 막을 수 있습니다.",
    prevention: [
      "음식물 거름망 상시 사용",
      "기름·국물은 따로 모아 버리기",
      "사용 후 따뜻한 물로 헹궈 내리기",
      "배수 속도가 느려지면 조기 점검",
    ],
    quote:
      "\"굳은 기름때는 물로 뚫리지 않습니다. 관 벽에 붙은 층을 직접 제거해야 합니다.\"",
  },
  변기막힘: {
    causes: [
      "화장지·물티슈 과다 사용",
      "이물질(위생용품 등) 투입",
      "노후 배관 및 정화조 연결부 문제",
      "배관 구배 불량으로 인한 정체",
    ],
    symptoms: [
      "물을 내려도 잘 내려가지 않음",
      "물이 차올랐다가 천천히 빠짐",
      "역류로 오수가 넘칠 위험",
      "배수 시 이상한 소리와 악취",
    ],
    deepTitle: "이물질 제거와 배관 점검이 중요한 이유",
    deepBody:
      "변기 막힘은 단순히 화장지가 뭉친 경우도 있지만, 물에 녹지 않는 물티슈나 위생용품이 배관 깊숙한 곳에 걸려 발생하는 경우가 많습니다. 이런 이물질은 압력만으로는 밀려나지 않고 오히려 더 단단하게 뭉칠 수 있어, 위치를 확인한 뒤 제거하는 작업이 필요합니다. 재발이 잦다면 정화조나 배관 연결부 상태까지 함께 점검해야 합니다.",
    prevention: [
      "물에 녹지 않는 물티슈 사용 자제",
      "위생용품은 반드시 별도 배출",
      "한 번에 많은 화장지 사용 피하기",
      "역류 조짐이 보이면 즉시 점검",
    ],
    quote:
      "\"물티슈는 물에 풀리지 않습니다. 변기 막힘의 가장 흔한 원인 중 하나입니다.\"",
  },
};

function getProfile(service: string): ServiceProfile {
  return PROFILES[service] ?? PROFILES["하수구막힘"];
}

function keypointList(items: string[]) {
  return `<ul class="keypoints">
${items.map((item) => `    <li>${item}</li>`).join("\n")}
  </ul>`;
}

/** 작업사진 섹션. 지역마다 다른 사진 묶음이 걸리도록 kw를 seed로 쓴다. */
function photoSection(manifest: SiteManifest, kw: string) {
  const photos = pickGallery(manifest, kw, 6);

  if (!photos.length) {
    return `    <div class="photo-note">※ 작업 사진 준비중입니다.</div>`;
  }

  const images = photos
    .map(
      (photo, index) =>
        `      <img src="${galleryPath(photo)}" alt="${kw} 작업사진 ${
          index + 1
        }" loading="lazy" width="900" height="600">`
    )
    .join("\n");

  return `    <div class="photo-grid">
${images}
    </div>
    <p><a href="/gallery.html">${kw} 작업사진 전체보기 →</a></p>`;
}

/** surinamcare.kr 형태의 상세 원고(본문)를 생성한다. */
export function renderArticle(
  manifest: SiteManifest,
  page: SitePageMeta
): string {
  const p = getProfile(page.service);
  const kw = page.keyword;

  return `
<article class="article section">
  <section class="block">
    <h2>${kw} 전문 ${manifest.brandName}</h2>
    <p>${page.region} 지역에서 발생하는 ${kw} 문제를 원인 진단부터 마무리 점검까지 단계별로 안내합니다. ${manifest.brandName}은 현장 상황을 먼저 확인한 뒤 작업 방식을 결정합니다.</p>
    <blockquote>${p.quote}</blockquote>
  </section>

  <section class="block">
    <h2>1. ${kw}이 발생하는 주요 원인</h2>
    ${keypointList(p.causes)}
    <p>${kw}은 한 가지 원인보다는 여러 요인이 겹쳐 발생하는 경우가 많습니다. 초기에는 배수가 조금 느려지는 정도지만, 원인을 방치하면 관 내부가 점점 좁아져 완전히 막히는 상태로 진행됩니다.</p>
  </section>

  <section class="block">
    <h2>2. ${kw} 현장 점검 과정</h2>
    <p>작업 전에 배수 상태와 배관 구조를 먼저 확인합니다. 무리하게 뚫는 방식이 아니라 막힘 위치와 원인을 파악한 뒤, 현장에 맞는 방법을 선택하는 것이 재발을 줄이는 핵심입니다.</p>
    ${keypointList([
      "배수 속도와 역류 여부 확인",
      "막힘 발생 위치 추정",
      "배관 구조 및 연결 상태 점검",
      "악취·누수 등 부가 증상 확인",
    ])}
  </section>

  <section class="block">
    <h2>3. ${kw} 배수불량 및 역류 증상</h2>
    ${keypointList(p.symptoms)}
    <p>아래 증상이 하나라도 반복된다면 관 내부가 이미 상당히 좁아졌을 가능성이 높습니다. 증상이 심해지기 전에 점검을 받는 것이 작업 범위와 비용 부담을 줄이는 방법입니다.</p>
  </section>

  <section class="block">
    <h2>4. ${kw} 해결 작업 방식</h2>
    <p>${manifest.brandName}의 ${kw} 작업은 아래 순서로 진행됩니다.</p>
    <div class="steps">
      <div class="step"><h3>1. 증상 확인</h3><p>배수 속도와 역류·악취 등 증상을 점검해 막힘 정도를 파악합니다.</p></div>
      <div class="step"><h3>2. 배관 구조 점검</h3><p>막힘 위치와 배관 연결 상태를 확인해 작업 방식을 정합니다.</p></div>
      <div class="step"><h3>3. 장비 작업</h3><p>현장 상황에 맞는 장비로 원인 층까지 제거하는 작업을 진행합니다.</p></div>
      <div class="step"><h3>4. 배수 테스트</h3><p>작업 후 실제 배수 상태를 확인해 마무리 점검을 진행합니다.</p></div>
    </div>
    <ol class="ordered">
      <li>증상 확인 및 원인 진단</li>
      <li>배관 구조 점검</li>
      <li>원인 제거 작업</li>
      <li>배수 테스트 및 마무리</li>
    </ol>
  </section>

  <section class="block">
    <h2>5. ${kw} 작업 사진</h2>
    <p>작업 과정과 결과는 현장 사진으로 확인하실 수 있습니다. 어떤 장비로 어떻게 작업이 진행되는지 직접 보시면 신뢰하고 맡기실 수 있습니다.</p>
${photoSection(manifest, kw)}
  </section>

  <section class="block">
    <h2>6. ${p.deepTitle}</h2>
    <p>${p.deepBody}</p>
  </section>

  <section class="block">
    <h2>7. ${kw} 배관내시경 및 고압세척</h2>
    <p>재발이 잦거나 원인이 명확하지 않은 경우, 배관내시경으로 관 내부를 직접 확인한 뒤 고압세척으로 고착된 오염 층을 제거합니다. 눈으로 상태를 확인하고 작업하기 때문에 불필요한 작업 없이 필요한 부분만 정확히 처리할 수 있습니다.</p>
  </section>

  <section class="block">
    <h2>8. ${kw} 예방 관리 방법</h2>
    ${keypointList(p.prevention)}
    <p>작은 습관만으로도 ${kw}의 재발 주기를 크게 늦출 수 있습니다. 이상 증상이 초기에 보일 때 점검받는 것이 가장 경제적인 관리 방법입니다.</p>
  </section>

  <section class="block">
    <div class="cta">
      <h2>9. ${kw} 24시간 상담 안내</h2>
      <p>${page.region} 지역 ${kw} 문제, 지금 바로 ${manifest.brandName}에 상담하세요.</p>
      <a class="btn" href="tel:${manifest.phone}">전화 ${manifest.phone}</a>
    </div>
  </section>
</article>`;
}
