// Metropolis-Hastings 采样 · 实现

export type Rng = () => number;
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export interface MhHooks {
  onPropose?: (cur: number, next: number) => void;
  onAccept?: (next: number, alpha: number) => void;
  onReject?: (cur: number, alpha: number) => void;
}

/** 标准正态密度（未归一化，用于示例目标分布）。 */
function gaussPdf(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return Math.exp(-(z * z) / 2);
}

/**
 * Metropolis-Hastings 采样目标分布（默认为 N(mu, sigma^2)）。
 * @param steps 采样步数
 * @param start 起点
 * @param targetP 目标密度（正比即可）
 * @param rng 随机源
 */
export function metropolisHastings(
  steps: number,
  start: number,
  targetP: (x: number) => number,
  rng: Rng,
  proposalStd = 1,
  hooks: MhHooks = {},
): number[] {
  const samples: number[] = [];
  let cur = start;
  let curP = targetP(cur);
  for (let i = 0; i < steps; i++) {
    // 对称高斯建议
    const next = cur + (rng() * 2 - 1) * proposalStd * 2;
    hooks.onPropose?.(cur, next);
    const nextP = targetP(next);
    const alpha = curP === 0 ? 1 : Math.min(1, nextP / curP);
    if (rng() < alpha) {
      cur = next;
      curP = nextP;
      hooks.onAccept?.(next, alpha);
    } else {
      hooks.onReject?.(cur, alpha);
    }
    samples.push(cur);
  }
  return samples;
}

/** 便捷：从 N(mu, sigma) 采样。 */
export function sampleGaussian(steps: number, mu: number, sigma: number, rng: Rng): number[] {
  return metropolisHastings(steps, mu, (x) => gaussPdf(x, mu, sigma), rng);
}
