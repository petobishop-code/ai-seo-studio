/**
 * 웨딩박람회 목록 데이터 (더미).
 *
 * 웨딩 페이지의 본체는 이 목록이다. 지금은 골격 확인용 예시 데이터이고,
 * 실제 운영 시에는 브랜드별 실데이터로 교체해야 한다.
 * (site-assets/brands/{브랜드}/wedding-events.json 로 빼는 방안을 권장)
 */
export type WeddingEvent = {
  /** 박람회명 */
  name: string;
  /** 개최 장소 */
  venue: string;
  /** 주소 */
  address: string;
  /** 일정 */
  date: string;
  /** 특전·혜택 */
  benefits: string[];
};

const EVENTS: Record<string, WeddingEvent[]> = {
  부산: [
    {
      name: "부산 다이렉트 웨딩박람회",
      venue: "벡스코 제2전시장",
      address: "부산 해운대구 APEC로 55",
      date: "매주 토·일 11:00~18:00",
      benefits: ["혼수 40만원 선불카드", "예식 페이백 100만원", "스드메 할인"],
    },
    {
      name: "롯데백화점 웨딩박람회",
      venue: "롯데백화점 부산본점 10층",
      address: "부산 부산진구 가야대로 772",
      date: "매월 첫째·셋째 주말",
      benefits: ["당일 계약 특전", "혼수 가전 할인", "무료 웨딩 컨설팅"],
    },
    {
      name: "W웨딩시티 박람회",
      venue: "서면 W웨딩시티",
      address: "부산 부산진구 중앙대로",
      date: "상시 (사전예약제)",
      benefits: ["드레스 무료 피팅", "스냅 촬영권", "허니문 상담"],
    },
  ],
  벡스코: [
    {
      name: "벡스코 웨딩박람회",
      venue: "벡스코 제1전시장",
      address: "부산 해운대구 APEC로 55",
      date: "매주 토·일 11:00~18:00",
      benefits: ["최대 규모 부스", "혼수 페이백", "예식장 동시 비교"],
    },
    {
      name: "벡스코 프리미엄 웨딩페어",
      venue: "벡스코 컨벤션홀",
      address: "부산 해운대구 APEC로 55",
      date: "분기별 대형 행사",
      benefits: ["프리미엄 홀 특가", "스드메 패키지", "웨딩카 지원"],
    },
  ],
  서면: [
    {
      name: "서면 웨딩박람회",
      venue: "서면 웨딩컨벤션",
      address: "부산 부산진구 서면로",
      date: "매주 주말 12:00~18:00",
      benefits: ["도심 접근성", "혼수 선불카드", "당일 계약 할인"],
    },
    {
      name: "서면 스드메 페어",
      venue: "서면 웨딩거리 일대",
      address: "부산 부산진구 중앙대로",
      date: "매월 둘째 주말",
      benefits: ["스튜디오·드레스·메이크업 비교", "패키지 특가"],
    },
  ],
};

/** 지역/장소에 맞는 박람회 목록. 없으면 부산 기본 목록으로 대체한다. */
export function getWeddingEvents(region: string): WeddingEvent[] {
  return EVENTS[region] ?? EVENTS["부산"];
}
