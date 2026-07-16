// 拒绝采样 · 纯算法实现
export interface RejectionHooks {
  onTry?: (x: number, y: number, accept: boolean) => void;
  onResult?: (x: number, y: number, tries: number) => void;
}

function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s / 0x100000000;
  };
}

/** 在 [-1,1]×[-1,1] 正方形内拒绝采样单位圆内的点。
 *  接受条件：x²+y² ≤ 1。期望接受率 π/4。 */
export function sampleUnitDisk(
  rng: () => number = lcg(42),
  hooks: RejectionHooks = {},
): { x: number; y: number; tries: number } {
  let tries = 0;
  while (true) {
    tries++;
    const x = rng() * 2 - 1;
    const y = rng() * 2 - 1;
    const accept = x * x + y * y <= 1;
    hooks.onTry?.(x, y, accept);
    if (accept) {
      hooks.onResult?.(x, y, tries);
      return { x, y, tries };
    }
  }
}

/** 通用拒绝采样：给定目标密度 p、提议 q（已归一化到 [0,1]）、常数 M。 */
export function rejectionSample(
  propose: () => number,
  density: (x: number) => number,
  M: number,
  rng: () => number = lcg(42),
  maxTries = 10000,
  hooks: RejectionHooks = {},
): number | null {
  for (let i = 0; i < maxTries; i++) {
    const x = propose();
    const u = rng();
    const accept = u < density(x) / M;
    hooks.onTry?.(x, u, accept);
    if (accept) {
      hooks.onResult?.(x, u, i + 1);
      return x;
    }
  }
  return null;
}

/** 蒙特卡洛估算 π：在单位正方形内撒 n 点，统计落入单位圆的比例 × 4。 */
export function estimatePi(n: number, rng: () => number = lcg(42)): number {
  let inside = 0;
  for (let i = 0; i < n; i++) {
    const x = rng() * 2 - 1;
    const y = rng() * 2 - 1;
    if (x * x + y * y <= 1) inside++;
  }
  return (4 * inside) / n;
}
