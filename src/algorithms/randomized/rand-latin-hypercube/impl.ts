// 拉丁超立方采样 · 纯算法实现
import { sattoloCycle } from '../rand-shuffle-sattolo-2/impl.ts';

export interface LHSHooks {
  onPermute?: (dim: number, perm: number[]) => void;
  onResult?: (samples: number[][]) => void;
}

function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s / 0x100000000;
  };
}

/** Fisher-Yates 洗牌（用于置换）。 */
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function latinHypercube(
  n: number,
  k: number,
  rng: () => number = lcg(42),
  hooks: LHSHooks = {},
): number[][] {
  if (n <= 0 || k <= 0) return [];
  // 每维生成一个置换（决定哪个样本占哪一段）+ 段内偏移
  const samples: number[][] = Array.from({ length: n }, () => new Array(k).fill(0));
  for (let d = 0; d < k; d++) {
    const perm = shuffle(
      Array.from({ length: n }, (_, i) => i),
      rng,
    );
    hooks.onPermute?.(d, [...perm]);
    for (let i = 0; i < n; i++) {
      const seg = perm[i]!;
      const offset = rng();
      samples[i]![d] = (seg + offset) / n;
    }
  }
  hooks.onResult?.(samples.map((r) => [...r]));
  return samples;
}

/** 验证 LHS 性质：每维每段恰好一个样本。 */
export function isLatinHypercube(samples: number[][], n: number, k: number): boolean {
  if (samples.length !== n) return false;
  for (let d = 0; d < k; d++) {
    const seen = new Set<number>();
    for (let i = 0; i < n; i++) {
      const seg = Math.floor(samples[i]![d]! * n);
      if (seg < 0 || seg >= n || seen.has(seg)) return false;
      seen.add(seg);
    }
    if (seen.size !== n) return false;
  }
  return true;
}

// 防止 tree-shake 删除导入
void sattoloCycle;
