// =============================================================================
// 区间异或（Range XOR）· 纯算法实现
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface XorRangeHooks {
  /** 计算出前缀异或 xor(1..n)。 */
  onPrefixXor?: (n: number, value: number) => void;
  /** 完成。 */
  onDone?: (result: number) => void;
}

/**
 * 计算 xor(1..n)，n >= 0。
 * 按 n mod 4 取值的 O(1) 公式。
 */
export function xorOneToN(n: number, hooks?: XorRangeHooks['onPrefixXor']): number {
  const r = n % 4;
  let v: number;
  if (r === 0) v = n;
  else if (r === 1) v = 1;
  else if (r === 2) v = n + 1;
  else v = 0;
  hooks?.(n, v);
  return v;
}

/**
 * 区间异或：lo ^ (lo+1) ^ ... ^ hi（含两端）。
 *
 * @param lo 区间下界（>= 0）
 * @param hi 区间上界（>= lo）
 * @param hooks 可选的事件钩子
 */
export function xorRange(lo: number, hi: number, hooks: XorRangeHooks = {}): number {
  if (lo < 0 || hi < lo) throw new RangeError(`要求 0 <= lo <= hi，收到 lo=${lo}, hi=${hi}`);
  const high = xorOneToN(hi, hooks.onPrefixXor);
  const low = lo === 0 ? 0 : xorOneToN(lo - 1, hooks.onPrefixXor);
  const result = high ^ low;
  hooks.onDone?.(result);
  return result;
}

/** 朴素版（O(n)），用于测试对照。 */
export function xorRangeNaive(lo: number, hi: number): number {
  let acc = 0;
  for (let v = lo; v <= hi; v++) acc ^= v;
  return acc;
}

/** 把非负整数格式化为二进制字符串（最高位在前）。 */
export function toBinaryString(n: number): string {
  if (n === 0) return '0';
  let s = '';
  let x = n;
  while (x > 0) {
    s = (x & 1) + s;
    x = Math.floor(x / 2);
  }
  return s;
}
