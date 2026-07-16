// =============================================================================
// 字符串哈希（多项式滚动哈希）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface HashStringHooks {
  /** 计算前缀哈希 h[i+1]（已纳入 s[i]）。 */
  onPrefix?: (i: number, hash: number) => void;
  /** 计算完成，给出前缀哈希数组。 */
  onDone?: (prefix: number[]) => void;
}

export const HASH_BASE = 131;
export const HASH_MOD = 1_000_000_007;

/**
 * 多项式滚动哈希：`h(s) = (s[0]*B^(m-1) + s[1]*B^(m-2) + ... + s[m-1]) mod M`。
 *
 * 用前缀哈希数组 `prefix[i] = hash(s[0..i-1])` 配合幂次表 `powB[i] = B^i mod M`，
 * 可在 O(1) 内求任意子串 `s[l..r]` 的哈希：
 *   `subHash(l, r) = (prefix[r+1] - prefix[l]*powB[r-l+1]) mod M`
 *
 * 构造时间 O(n)，单次子串查询 O(1)，空间 O(n)。
 *
 * @returns 前缀哈希数组 `prefix`（长度 n+1，prefix[0]=0）
 */
export function hashString(s: string, hooks: HashStringHooks = {}): number[] {
  const n = s.length;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = (prefix[i]! * HASH_BASE + s.charCodeAt(i)) % HASH_MOD;
    hooks.onPrefix?.(i, prefix[i + 1]!);
  }
  hooks.onDone?.(prefix);
  return prefix;
}

/** 预计算幂次表 powB[i] = BASE^i mod MOD，长度 len。 */
export function buildPowB(len: number): number[] {
  const pow = new Array<number>(len).fill(1);
  for (let i = 1; i < len; i++) pow[i] = (pow[i - 1]! * HASH_BASE) % HASH_MOD;
  return pow;
}

/**
 * 子串哈希：给定前缀哈希数组与幂次表，返回 s[l..r]（闭区间）的哈希值。
 * 需 l<=r 且均在 [0, n) 内；调用方负责边界。
 */
export function subHash(prefix: number[], powB: number[], l: number, r: number): number {
  const h = (prefix[r + 1]! - ((prefix[l]! * powB[r - l + 1]!) % HASH_MOD) + HASH_MOD) % HASH_MOD;
  return h;
}
