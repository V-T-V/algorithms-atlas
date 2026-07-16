// =============================================================================
// 罗马数字（Roman Numerals）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 值—符号对，从大到小排列（含减法记法）。 */
const VALUE_SYMBOLS: ReadonlyArray<readonly [number, string]> = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/** 符号—值映射。 */
const SYMBOL_VALUE: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

/** 整数→罗马转换过程的事件钩子。 */
export interface IntToRomanHooks {
  /** 每取出一个值—符号对（可能多次触发同一对）。 */
  onSymbol?: (value: number, symbol: string) => void;
}

/** 罗马→整数转换过程的事件钩子。 */
export interface RomanToIntHooks {
  /** 每解析一个符号（含减法判定）。 */
  onSymbol?: (value: number, symbol: string) => void;
}

/**
 * 整数转罗马数字（贪心，支持 1..3999）。
 *
 * @param n 整数（1 <= n <= 3999）
 * @param hooks 可选事件钩子
 * @returns 罗马数字字符串
 */
export function intToRoman(n: number, hooks: IntToRomanHooks = {}): string {
  if (n < 1 || n > 3999 || !Number.isInteger(n)) {
    throw new Error(`n 必须是 1..3999 的整数 / n must be an integer in [1, 3999], got ${n}`);
  }
  let result = '';
  let rest = n;
  for (const [value, symbol] of VALUE_SYMBOLS) {
    while (rest >= value) {
      result += symbol;
      rest -= value;
      hooks.onSymbol?.(value, symbol);
    }
  }
  return result;
}

/**
 * 罗马数字转整数（单遍扫描，支持减法记法）。
 *
 * @param s 罗马数字字符串（仅含 IVXLCDM，需为合法形式）
 * @param hooks 可选事件钩子
 * @returns 整数（1..3999）
 */
export function romanToInt(s: string, hooks: RomanToIntHooks = {}): number {
  const upper = s.toUpperCase();
  if (!/^[IVXLCDM]+$/.test(upper)) {
    throw new Error(`非法罗马数字 / invalid Roman numeral: ${s}`);
  }
  let total = 0;
  for (let i = 0; i < upper.length; i++) {
    const cur = SYMBOL_VALUE[upper[i]!]!;
    const next = i + 1 < upper.length ? SYMBOL_VALUE[upper[i + 1]!]! : 0;
    if (cur < next) {
      total -= cur;
      hooks.onSymbol?.(-cur, upper[i]!);
    } else {
      total += cur;
      hooks.onSymbol?.(cur, upper[i]!);
    }
  }
  return total;
}
