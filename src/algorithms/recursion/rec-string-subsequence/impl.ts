// 字符串子序列 · 实现

const MOD = 1000000007;

export interface SubseqHooks {
  onChar?: (index: number, char: string, count: number) => void;
}

/**
 * 统计不同非空子序列个数（含空串则结果-1）。
 * 递归定义：f(i) = 2·f(i-1) - f(last[c]-1)，其中 last[c] 是字符 c 上次出现位置。
 * 这里用尾递归式迭代实现递推，并提供递归版计数函数。
 */
export function distinctSubsequences(s: string, hooks: SubseqHooks = {}): number {
  const n = s.length;
  // f[i] = 前 i 个字符的不同子序列数（含空串）
  const f = new Array<number>(n + 1).fill(0);
  f[0] = 1; // 空串
  const last = new Map<string, number>();
  for (let i = 1; i <= n; i++) {
    const c = s[i - 1]!;
    f[i] = (2 * f[i - 1]!) % MOD;
    if (last.has(c)) {
      const prev = last.get(c)!;
      f[i] = (f[i]! - f[prev - 1]! + MOD) % MOD;
    }
    last.set(c, i);
    hooks.onChar?.(i - 1, c, f[i]!);
  }
  // 减去空串
  return (f[n]! - 1 + MOD) % MOD;
}

/** 朴素递归（带记忆化，按下标）：返回 s 的所有不同子序列数（含空串）。 */
export function distinctSubsequencesRec(s: string): number {
  const n = s.length;
  const memo = new Array<number>(n + 1).fill(-1);
  // nextSame[i] = 下一个与 s[i] 相同的字符下标（无则 -1）
  const nextSame = new Array<number>(n).fill(-1);
  const seen = new Map<string, number>();
  for (let i = n - 1; i >= 0; i--) {
    nextSame[i] = seen.has(s[i]!) ? seen.get(s[i]!)! : -1;
    seen.set(s[i]!, i);
  }
  // count(i) = 前 i 个字符的不同子序列数（含空串）
  const count = (i: number): number => {
    if (i === 0) return 1;
    if (memo[i] !== -1) return memo[i]!;
    // f(i) = 2*f(i-1) - f(last[s[i-1]] - 1)
    const c = s[i - 1]!;
    let res = (2 * count(i - 1)) % MOD;
    // 找 c 在 [0, i-1) 中最后出现位置
    let last = -1;
    for (let j = 0; j < i - 1; j++) if (s[j] === c) last = j;
    if (last !== -1) res = (res - count(last) + MOD) % MOD;
    memo[i] = res;
    return res;
  };
  void nextSame;
  return count(n);
}
