/**
 * 웨딩박람회 목록 — reply-alba 신청 링크 카탈로그.
 *
 * 지금은 부산웨딩박람회 브랜드의 실데이터를 여기 둔다.
 * 웨딩 브랜드가 여러 개가 되면 site-assets/brands/{brandSlug}/wedding-events.json 으로
 * 빼서 브랜드마다 다른 카탈로그를 쓰도록 바꿔야 한다. (지금은 단일 브랜드라 모듈에 둔다.)
 */
export type WeddingEvent = {
  /** 박람회명 */
  name: string;
  /** reply-alba 신청 페이지 링크 */
  link: string;
};

export type WeddingRegionGroup = {
  /** 섹션 제목. 예: "부산 웨딩박람회" */
  region: string;
  events: WeddingEvent[];
};

/** 메인 상단에 바로 연결할 대표 신청 링크 (부산 웨딩박람회) */
export const MAIN_APPLY_LINK = "https://replyalba.com/pt/LOQI92OJxc";

/** 박람회명 → 세부 페이지 파일명. 공백을 제거해 한글 파일명으로 쓴다. */
export function fairFile(name: string) {
  return `${name.replace(/\s+/g, "")}.html`;
}

/** 박람회명에서 지역(도시)을 추정한다. areaServed·그룹핑에 쓴다. */
export function fairCity(name: string) {
  if (name.includes("울산")) return "울산";
  if (name.includes("창원")) return "창원";
  return "부산";
}

export const WEDDING_CATALOG: WeddingRegionGroup[] = [
  {
    region: "부산 웨딩박람회",
    events: [
      { name: "부산 웨딩박람회", link: "https://replyalba.com/pt/LOQI92OJxc" },
      { name: "부산 KNN 웨딩엑스포", link: "https://replyalba.com/pt/10OMZg0DPSC" },
      { name: "부산 롯데백화점 웨딩엑스포", link: "https://replyalba.com/pt/YLoADdrbgU" },
      { name: "부산 W웨딩 신세계센텀 웨딩박람회", link: "https://replyalba.com/pt/IMrka2f2yA" },
      { name: "부산 W웨딩시티 웨딩박람회", link: "https://replyalba.com/pt/RjM9JP4hdc" },
      { name: "BWB 부산 벡스코 웨딩박람회", link: "https://replyalba.com/pt/B2VsSropw9" },
      { name: "부산 더블혜택 웨딩박람회", link: "https://replyalba.com/pt/LOQI92OJxc" },
      { name: "부산 라모르 웨딩박람회", link: "https://replyalba.com/pt/SO0299MJDg" },
      { name: "부산 KNN 방송국 웨딩박람회", link: "https://replyalba.com/pt/IIBQpcZBZO" },
      { name: "부산 찰스 웨딩박람회", link: "https://replyalba.com/pt/YnMW6eOiUJ" },
      { name: "부산 투어민 허니문초대전", link: "https://replyalba.com/pt/AcePupJWF6" },
    ],
  },
  {
    region: "경남 웨딩박람회",
    events: [
      { name: "울산 롯데백화점 웨딩박람회", link: "https://replyalba.com/pt/D8avXLYA5m" },
      { name: "울산 반하나 허니문박람회", link: "https://replyalba.com/pt/zSh4LNTEY2" },
      { name: "창원 롯데백화점 웨딩박람회", link: "https://replyalba.com/pt/ZfXRUhsOCl" },
      { name: "창원 인터내셔널 호텔 웨딩박람회", link: "https://replyalba.com/pt/FqD0vuXnHV" },
      { name: "창원 웨딩박람회", link: "https://replyalba.com/pt/L9ITINvvbp" },
      { name: "창원 프리마베라 웨딩박람회", link: "https://replyalba.com/pt/XtwCqyEBAs" },
    ],
  },
];
