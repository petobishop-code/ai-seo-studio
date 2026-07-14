import { drainIndustry } from "./drain";
import { weddingIndustry } from "./wedding";
import type { IndustryModule } from "./types";

const MODULES: IndustryModule[] = [drainIndustry, weddingIndustry];

const BY_LABEL = new Map(MODULES.map((module) => [module.label, module]));

/**
 * 업종 라벨(위저드에서 고른 값)로 모듈을 찾는다.
 * 아직 모듈이 없는 업종은 하수구로 폴백한다.
 */
export function getIndustry(label: string): IndustryModule {
  return BY_LABEL.get(label.trim()) ?? drainIndustry;
}

/** 모듈이 실제로 구현된 업종인지 */
export function hasIndustry(label: string) {
  return BY_LABEL.has(label.trim());
}

export function industryAssetDir(label: string) {
  return getIndustry(label).key;
}
