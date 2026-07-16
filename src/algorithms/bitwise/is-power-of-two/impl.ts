// =============================================================================
// 判断 2 的幂（Is Power of Two）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」暴露判断过程的每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface IsPowerOfTwoHooks {
  /** 显示输入 n 的二进制表示（每位 0/1）。 */
  onBinary?: (n: number, bits: number[]) => void;
  /** 计算 n - 1 的二进制表示。 */
  onMinusOne?: (n: number, minusOne: number, bits: number[]) => void;
  /** 计算 n & (n - 1) 的结果。 */
  onAnd?: (andResult: number, bits: number[]) => void;
  /** 得出结论。 */
  onResult?: (n: number, isPow2: boolean) => void;
}

/** 把非负整数转成 width 位二进制数组（高位在前）。 */
export function toBinaryArray(n: number, width: number = 8): number[] {
  const bits: number[] = [];
  const u = n >>> 0;
  for (let i = width - 1; i >= 0; i--) {
    bits.push((u >>> i) & 1);
  }
  return bits;
}

/**
 * 判断一个正整数是否为 2 的幂。
 *
 * 核心技巧：`n & (n - 1)` 会清掉 n 的最低位的 1。
 * 2 的幂的二进制只有一个 1（如 8 = 1000），所以 `n & (n - 1) === 0`。
 * 需额外排除 n <= 0（0 和负数不是 2 的幂）。
 *
 * 时间复杂度 O(1)，空间 O(1)。
 *
 * @param n 输入整数
 * @param hooks 可选事件钩子
 * @returns n 是否为 2 的幂
 */
export function isPowerOfTwo(n: number, hooks: IsPowerOfTwoHooks = {}): boolean {
  if (!Number.isInteger(n)) {
    throw new RangeError(`isPowerOfTwo 要求整数，收到 ${n}`);
  }

  const width = n <= 0xffff ? 16 : 32;
  hooks.onBinary?.(n, toBinaryArray(n < 0 ? n >>> 0 : n, width));

  // n <= 0 一定不是 2 的幂
  if (n <= 0) {
    hooks.onResult?.(n, false);
    return false;
  }

  const minusOne = n - 1;
  hooks.onMinusOne?.(n, minusOne, toBinaryArray(minusOne, width));

  const andResult = n & minusOne;
  hooks.onAnd?.(andResult, toBinaryArray(andResult, width));

  const result = andResult === 0;
  hooks.onResult?.(n, result);
  return result;
}

/**
 * 循环除 2 法：不断把 n 除以 2，若中途出现奇数（且非 1）则非 2 的幂。
 * 时间 O(log n)。用于对比验证。
 */
export function isPowerOfTwoByDivision(n: number): boolean {
  if (!Number.isInteger(n) || n <= 0) return false;
  let x = n;
  while (x > 1) {
    if (x % 2 !== 0) return false;
    x = Math.floor(x / 2);
  }
  return true;
}
