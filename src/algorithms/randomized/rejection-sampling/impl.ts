// =============================================================================
// 拒绝采样（Rejection Sampling）· 纯算法实现
// 在包围框 [0..n) × [0..maxDensity] 中均匀采样，若 y ≤ f(x) 则接受。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每步尝试。
// =============================================================================

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** 事件钩子。 */
export interface RejectionHooks {
  /** 每次尝试：候选 x、随机高度 y、是否接受。 */
  onTry?: (x: number, y: number, accepted: boolean) => void;
  /** 每次接受一个样本。 */
  onAccept?: (x: number) => void;
  /** 每次拒绝。 */
  onReject?: (x: number, y: number) => void;
}

/** 确定性 RNG（便于单测）。 */
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    return s / 0x100000000;
  };
}

/**
 * 拒绝采样：从离散密度 f 采一个样本。
 *
 * @param density 密度数组（非负），density[x] 为 x 的相对密度
 * @param rng [0,1) 随机源
 * @param hooks 可选钩子
 * @returns 采样到的下标
 */
export function sampleOne(
  density: readonly number[],
  rng: Rng = Math.random,
  hooks: RejectionHooks = {},
): number {
  const n = density.length;
  if (n === 0) throw new Error('密度数组为空');
  let maxD = 0;
  for (const d of density) {
    if (d < 0) throw new Error('密度必须非负');
    if (d > maxD) maxD = d;
  }
  if (maxD === 0) throw new Error('密度全为 0');

  // 安全上限，避免极端低接受率死循环
  const maxAttempts = 100000;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const x = Math.floor(rng() * n) % n;
    const y = rng() * maxD;
    const accepted = y <= density[x]!;
    hooks.onTry?.(x, y, accepted);
    if (accepted) {
      hooks.onAccept?.(x);
      return x;
    }
    hooks.onReject?.(x, y);
  }
  throw new Error('拒绝采样超过最大尝试次数');
}

/**
 * 批量采样 N 个，返回每个下标的采样计数。
 *
 * @param density 密度数组
 * @param count 采样总数
 * @param rng [0,1) 随机源
 * @param hooks 可选钩子
 * @returns 各下标的计数数组
 */
export function sampleMany(
  density: readonly number[],
  count: number,
  rng: Rng = Math.random,
  hooks: RejectionHooks = {},
): number[] {
  const counts = new Array<number>(density.length).fill(0);
  for (let i = 0; i < count; i++) {
    const x = sampleOne(density, rng, hooks);
    counts[x]!++;
  }
  return counts;
}

/**
 * 估计接受率（尝试数 / 接受数）。
 */
export function acceptanceRate(
  density: readonly number[],
  trials: number,
  rng: Rng = Math.random,
): number {
  const n = density.length;
  let maxD = 0;
  for (const d of density) if (d > maxD) maxD = d;
  if (maxD === 0) return 0;
  let accepted = 0;
  for (let i = 0; i < trials; i++) {
    const x = Math.floor(rng() * n) % n;
    const y = rng() * maxD;
    if (y <= density[x]!) accepted++;
  }
  return accepted / trials;
}
