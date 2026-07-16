// 一维随机游走 · 实现

export type Rng = () => number;
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export interface RwHooks {
  onStep?: (t: number, pos: number) => void;
}

/** 一维随机游走，返回位置序列（含 S_0=0）。 */
export function randomWalk(steps: number, rng: Rng, pRight = 0.5, hooks: RwHooks = {}): number[] {
  const pos: number[] = [0];
  hooks.onStep?.(0, 0);
  let cur = 0;
  for (let t = 1; t <= steps; t++) {
    cur += rng() < pRight ? 1 : -1;
    pos.push(cur);
    hooks.onStep?.(t, cur);
  }
  return pos;
}

/** 统计：是否曾回到原点。 */
export function everReturnedToOrigin(positions: number[]): boolean {
  return positions.slice(1).some((p) => p === 0);
}
