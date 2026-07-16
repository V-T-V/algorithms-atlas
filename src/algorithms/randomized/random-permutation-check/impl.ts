// =============================================================================
// 随机排列生成与校验 · 纯算法实现
// Fisher-Yates 生成均匀随机排列；布尔计数法 + 指纹法校验排列合法性。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** 事件钩子。 */
export interface PermutationHooks {
  /** Fisher-Yates：在第 i 步，随机选 j 并交换 arr[i] 与 arr[j]。 */
  onSwap?: (i: number, j: number, arr: number[]) => void;
  /** 完成 Fisher-Yates。 */
  onShuffleDone?: (arr: number[]) => void;
  /** 计数法校验：处理第 i 个值 v。 */
  onCheckValue?: (i: number, v: number, ok: boolean) => void;
  /** 校验结论。 */
  onVerifyResult?: (method: 'count' | 'fingerprint', valid: boolean) => void;
}

/** 确定性 RNG（Mulberry32）。 */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates 洗牌：生成 [0, n) 的均匀随机排列（原地构造）。
 */
export function fisherYatesShuffle(
  n: number,
  rng: Rng = Math.random,
  hooks: PermutationHooks = {},
): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1)); // j ∈ [0, i]
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
    hooks.onSwap?.(i, j, arr);
  }
  hooks.onShuffleDone?.(arr);
  return arr;
}

/**
 * 计数法校验：判断 arr 是否恰为 [0, n) 的一个排列。
 * O(n) 时间、O(n) 空间，无误差。
 */
export function verifyByCounting(arr: number[], hooks: PermutationHooks = {}): boolean {
  const n = arr.length;
  const seen = new Array<boolean>(n).fill(false);
  for (let i = 0; i < n; i++) {
    const v = arr[i]!;
    const ok = v >= 0 && v < n && !seen[v];
    hooks.onCheckValue?.(i, v, ok);
    if (!ok) {
      hooks.onVerifyResult?.('count', false);
      return false;
    }
    seen[v] = true;
  }
  hooks.onVerifyResult?.('count', true);
  return true;
}

/**
 * 指纹法校验：比较 arr 与 [0,n) 的「和 + 平方和」。
 * O(n) 时间、O(1) 额外空间，对非排列输入有极小碰撞概率（平方和指纹）。
 */
export function verifyByFingerprint(arr: number[], hooks: PermutationHooks = {}): boolean {
  const n = arr.length;
  // [0,n) 的和 = n(n−1)/2，平方和 = n(n−1)(2n−1)/6
  const expectSum = (n * (n - 1)) / 2;
  const expectSq = (n * (n - 1) * (2 * n - 1)) / 6;
  let sum = 0;
  let sq = 0;
  for (let i = 0; i < n; i++) {
    const v = arr[i]!;
    sum += v;
    sq += v * v;
    hooks.onCheckValue?.(i, v, true);
  }
  const valid = sum === expectSum && sq === expectSq;
  hooks.onVerifyResult?.('fingerprint', valid);
  return valid;
}

/**
 * 综合：生成随机排列并校验。
 * @returns { permutation, validCount, validFingerprint }
 */
export function generateAndVerify(
  n: number,
  rng: Rng = Math.random,
  hooks: PermutationHooks = {},
): { permutation: number[]; validCount: boolean; validFingerprint: boolean } {
  const permutation = fisherYatesShuffle(n, rng, hooks);
  const validCount = verifyByCounting(permutation);
  const validFingerprint = verifyByFingerprint(permutation);
  return { permutation, validCount, validFingerprint };
}
