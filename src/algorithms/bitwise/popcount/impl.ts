// =============================================================================
// 位计数 / 人口计数（Population Count / Popcount）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子（用于 Kernighan 法的可视化）。任一可选。 */
export interface PopcountHooks {
  /** 探测到当前最低位的 1（即 n & -n）。给出当前 n 与被探测到的位值。 */
  onBit?: (n: number, lowestSetBitValue: number) => void;
  /** 清掉最低位的 1 后，得到新的 n。 */
  onClear?: (n: number, clearedCount: number) => void;
}

/**
 * Brian Kernighan 算法：统计一个非负整数的二进制中 1 的个数。
 * 关键技巧：`n & (n - 1)` 会把 n 的最低位的 1 变成 0，
 * 因此循环次数恰好等于 1 的个数（而非位数），对稀疏比特尤其高效。
 *
 * @param n 非负整数（≤ 2^53 - 1 的安全整数范围）
 * @param hooks 可选的事件钩子
 * @returns 1 的个数
 */
/**
 * 取最低位的 1 的位值（等价于 n & -n，但对 >2^31 的安全整数也成立）。
 * 即：能整除 n 的最大 2 的幂。
 */
function lowestSetBitValue(n: number): number {
  // n & -n 在 JS 中会被强转为 32 位有符号整数，故改用算术实现以支持大整数。
  let low = 1;
  let x = n;
  while (x % 2 === 0) {
    low *= 2;
    x = Math.floor(x / 2);
  }
  return low;
}

/** 清除最低位的 1（等价于 n & (n-1)，但对 >2^31 的安全整数也成立）。 */
function clearLowestSetBit(n: number): number {
  // 算术版：n - lowestSetBitValue(n)
  return n - lowestSetBitValue(n);
}

export function popcountKernighan(n: number, hooks: PopcountHooks = {}): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`popcount 要求非负整数，收到 ${n}`);
  }
  let count = 0;
  let x = n;
  while (x > 0) {
    const low = lowestSetBitValue(x); // 最低位的 1 的位值
    hooks.onBit?.(x, low);
    x = clearLowestSetBit(x); // 清除最低位的 1
    count++;
    hooks.onClear?.(x, count);
  }
  return count;
}

/** 256 项查表（每字节 0..255 的 1 的个数），用于查表法。 */
const POPCOUNT_TABLE: readonly number[] = (() => {
  const t = new Array<number>(256);
  for (let i = 0; i < 256; i++) {
    t[i] = popcountKernighan(i);
  }
  return t;
})();

/**
 * 查表法（lookup table）：每次处理一个字节（8 位），
 * 用预计算的 256 项表直接给出该字节的 1 的个数再累加。
 * 复杂度固定为 O(1)（对 32 位整数而言 4 次查表）。
 *
 * @param n 非负整数
 * @returns 1 的个数
 */
export function popcountTable(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`popcount 要求非负整数，收到 ${n}`);
  }
  let count = 0;
  let x = n;
  while (x > 0) {
    count += POPCOUNT_TABLE[x & 0xff]!;
    x = Math.floor(x / 256); // 等价于 >>>8，但支持 >2^32 的安全整数
  }
  return count;
}

/** 默认实现：优先用查表法（常数级），等价于上面两者。 */
export function popcount(n: number): number {
  return popcountTable(n);
}

/** 把一个非负整数格式化为 2 进制字符串（最高位在前），便于可视化展示。 */
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
