// =============================================================================
// MinHash · 纯算法实现
// 用 k 个独立哈希求每个的最小值构成签名；签名匹配比例估计 Jaccard。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface MinHashHooks {
  /** 处理集合中一个元素：哈希函数 i 的值，是否更新了该函数的最小值。 */
  onElement?: (item: string, hashIndex: number, hashValue: number, updated: boolean) => void;
  /** 完成一个集合的签名。 */
  onSignature?: (label: string, signature: number[]) => void;
}

/** 32 位哈希函数族（不同种子）。 */
export function hashWithSeed(seed: number, item: string): number {
  let h = seed >>> 0;
  for (let i = 0; i < item.length; i++) {
    h ^= item.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 产生 k 个种子（确定性）。 */
function makeSeeds(k: number): number[] {
  const seeds: number[] = [];
  for (let i = 0; i < k; i++) seeds.push((0x9747b28c + i * 0x9e3779b1) >>> 0);
  return seeds;
}

export class MinHash {
  readonly k: number;
  readonly seeds: number[];
  signature: number[];

  constructor(k: number = 128, seeds?: number[]) {
    if (k < 1) throw new Error('k 必须 ≥ 1');
    this.k = k;
    this.seeds = seeds ?? makeSeeds(k);
    this.signature = new Array<number>(k).fill(0xffffffff);
  }

  /** 处理一个元素（更新签名）。 */
  add(item: string, hooks: MinHashHooks = {}): void {
    for (let i = 0; i < this.k; i++) {
      const hv = hashWithSeed(this.seeds[i]!, item);
      if (hv < this.signature[i]!) {
        this.signature[i] = hv;
        hooks.onElement?.(item, i, hv, true);
      } else {
        hooks.onElement?.(item, i, hv, false);
      }
    }
  }

  /** 批量处理一个集合。 */
  addAll(items: Iterable<string>, hooks: MinHashHooks = {}): void {
    for (const it of items) this.add(it, hooks);
  }

  /** 完成签名（触发 onSignature 钩子）。 */
  finalize(label: string, hooks: MinHashHooks = {}): number[] {
    hooks.onSignature?.(label, [...this.signature]);
    return [...this.signature];
  }

  /** 估计与另一签名的 Jaccard 相似度（匹配分量比例）。 */
  static jaccardEstimate(sigA: readonly number[], sigB: readonly number[]): number {
    if (sigA.length !== sigB.length) throw new Error('签名长度不同');
    if (sigA.length === 0) return 0;
    let match = 0;
    for (let i = 0; i < sigA.length; i++) {
      if (sigA[i] === sigB[i]) match++;
    }
    return match / sigA.length;
  }

  /** 重置签名。 */
  reset(): void {
    this.signature.fill(0xffffffff);
  }
}

/** 便捷：计算两集合的 Jaccard 估计。 */
export function estimateJaccard(
  setA: readonly string[],
  setB: readonly string[],
  k: number = 128,
): number {
  const a = new MinHash(k);
  for (const it of setA) a.add(it);
  const sigA = a.finalize('A');
  const b = new MinHash(k);
  for (const it of setB) b.add(it);
  const sigB = b.finalize('B');
  return MinHash.jaccardEstimate(sigA, sigB);
}

/** 精确 Jaccard（用于校验）。 */
export function exactJaccard(setA: readonly string[], setB: readonly string[]): number {
  const A = new Set(setA);
  const B = new Set(setB);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  if (union === 0) return 0;
  return inter / union;
}
