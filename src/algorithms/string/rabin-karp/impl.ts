// =============================================================================
// Rabin-Karp 哈希匹配 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 采用滚动哈希 + 大质数取模，避免溢出。
// =============================================================================

/** Rabin-Karp 默认参数：字符集基数与大质数模数。 */
export const RK_RADIX = 256;
export const RK_MOD = 1000000007;

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RabinKarpHooks {
  /** 计算出模式的哈希值 hashPat。 */
  onPatHash?: (hashPat: number) => void;
  /** 计算出文本前缀窗口 [0, m) 的哈希。 */
  onInitWindow?: (start: number, hashWin: number) => void;
  /** 滚动到新窗口起点 start，更新后的窗口哈希为 hashWin。 */
  onRoll?: (start: number, hashWin: number) => void;
  /** 哈希相等时做逐字符校验，结果 equal。 */
  onVerify?: (start: number, equal: boolean) => void;
  /** 在文本下标 start 处完整匹配到模式。 */
  onFound?: (start: number) => void;
}

/** 求模逆元风格的「最高位权值」`pow(radix, m-1) mod MOD`，用于滚动去首位。 */
function highestPow(radix: number, mod: number, m: number): number {
  let p = 1;
  for (let i = 1; i <= m - 1; i++) p = (p * radix) % mod;
  return p;
}

/** `(a - b) % mod` 的非负结果。 */
function subMod(a: number, b: number, mod: number): number {
  return (a - b + mod) % mod;
}

/**
 * Rabin-Karp 字符串匹配：在 `text` 中找出所有 `pat` 出现的起点下标。
 *
 * - 先算模式串哈希 `hashPat`，以及文本前缀窗口哈希
 * - 每个窗口比较哈希；哈希相等时再逐字符校验（排除哈希碰撞）
 * - 窗口右移一位用滚动公式 `O(1)` 更新哈希
 *
 * 采用基数 `radix=256` 与大质数 `MOD` 取模避免溢出。平均 `O(n+m)`，
 * 最坏（大量哈希碰撞）退化到 `O(n·m)`。空模式 / `m > n` 返回 `[]`。
 *
 * @returns 所有匹配起点下标（升序）
 */
export function rabinKarp(
  text: string,
  pat: string,
  hooks: RabinKarpHooks = {},
  radix: number = RK_RADIX,
  mod: number = RK_MOD,
): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];

  // 模式哈希
  let hashPat = 0;
  for (let j = 0; j < m; j++) {
    hashPat = (hashPat * radix + pat.charCodeAt(j)) % mod;
  }
  hooks.onPatHash?.(hashPat);

  const high = highestPow(radix, mod, m);

  // 文本首个窗口哈希
  let hashWin = 0;
  for (let j = 0; j < m; j++) {
    hashWin = (hashWin * radix + text.charCodeAt(j)) % mod;
  }
  hooks.onInitWindow?.(0, hashWin);

  const result: number[] = [];
  for (let s = 0; s <= n - m; s++) {
    if (s > 0) {
      // 滚动：去掉 text[s-1]，加上 text[s+m-1]
      const out = (text.charCodeAt(s - 1) * high) % mod;
      const inn = text.charCodeAt(s + m - 1);
      hashWin = (subMod(hashWin, out, mod) * radix + inn) % mod;
      hooks.onRoll?.(s, hashWin);
    }
    if (hashWin === hashPat) {
      // 哈希命中，逐字符校验避免误判
      let equal = true;
      for (let j = 0; j < m; j++) {
        if (text.charCodeAt(s + j) !== pat.charCodeAt(j)) {
          equal = false;
          break;
        }
      }
      hooks.onVerify?.(s, equal);
      if (equal) {
        result.push(s);
        hooks.onFound?.(s);
      }
    }
  }
  return result;
}
