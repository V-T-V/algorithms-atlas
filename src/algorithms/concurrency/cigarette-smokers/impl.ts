// =============================================================================
// 抽烟者问题（Cigarette Smokers）· 纯算法实现（事件序列模拟）
// 代理放两种原料，对应抽烟者取走并抽烟。零 DOM 依赖，可独立单测。
// =============================================================================

/** 三种原料。 */
export type Ingredient = 'tobacco' | 'paper' | 'matches';

export interface SmokerStep {
  /** 本轮代理放的两种原料。 */
  offer: [Ingredient, Ingredient];
  /** 行动的抽烟者 id（0/1/2）。 */
  smoker: number;
  /** 该抽烟者拥有的原料。 */
  has: Ingredient;
}

export interface SmokersHooks {
  /** 代理放料 offer。 */
  onOffer?: (offer: [Ingredient, Ingredient]) => void;
  /** 抽烟者 smoker 取走原料开始卷烟。 */
  onSmoke?: (smoker: number, has: Ingredient) => void;
  /** 抽烟者抽完，通知代理。 */
  onFinish?: (smoker: number) => void;
}

/** 抽烟者 i 拥有的原料（i=0 tobacco, i=1 paper, i=2 matches）。 */
export const SMOKER_HAS: Ingredient[] = ['tobacco', 'paper', 'matches'];

/** 给定 offer，返回应行动的抽烟者（拥有第三种原料的人）。 */
export function pickSmoker(offer: [Ingredient, Ingredient]): number {
  const set = new Set<Ingredient>(offer);
  if (!set.has('tobacco')) return 0;
  if (!set.has('paper')) return 1;
  return 2;
}

/**
 * 抽烟者问题模拟。
 *
 * @param offers 代理的放料序列（每个元素是两种原料）
 * @param hooks 可选钩子
 * @returns 每轮步骤
 */
export function simulateSmokers(
  offers: ReadonlyArray<readonly [Ingredient, Ingredient]>,
  hooks: SmokersHooks = {},
): SmokerStep[] {
  const steps: SmokerStep[] = [];
  for (const offer of offers) {
    const o: [Ingredient, Ingredient] = [offer[0], offer[1]];
    hooks.onOffer?.(o);
    const smoker = pickSmoker(o);
    const has = SMOKER_HAS[smoker]!;
    hooks.onSmoke?.(smoker, has);
    hooks.onFinish?.(smoker);
    steps.push({ offer: o, smoker, has });
  }
  return steps;
}
