export type ProjectCategory =
  | "하수구/배관"
  | "병원"
  | "부동산"
  | "쇼핑몰"
  | "학원"
  | "기타";

export type Project = {
  id: string;
  name: string;
  domain: string;
  category: ProjectCategory;
  region: string;
  status: "준비중" | "운영중" | "중지";
};