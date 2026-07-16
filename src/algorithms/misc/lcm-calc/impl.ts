// =============================================================================
// 最小公倍数 · 纯算法实现
// LCM(a,b) = (a/GCD) * b，先除后乘防溢出。零 DOM 依赖，可独立单测。
// =============================================================================

/** 内联迭代 GCD（保持模块自包含）。 */
function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const r = x % y;
    x = y;
    y = r;
  }
  return x;
}

/** 事件钩子。 */
export interface LcmHooks {
  /** 求出 GCD 后。 */
  onGcd?: (a: number, b: number, g: number) => void;
  /** 算出 LCM 后。 */
  onResult?: (a: number, b: number, lcm: number) => void;
}

/**
 * 最小公倍数 LCM(a, b)。
 * 若 a 或 b 为 0，返回 0。对负数取绝对值。
 */
export function lcm(a: number, b: number, hooks: LcmHooks = {}): number {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new RangeError('a and b must be integers');
  }
  if (a === 0 || b === 0) {
    hooks.onResult?.(a, b, 0);
    return 0;
  }
  const g = gcd(a, b);
  hooks.onGcd?.(a, b, g);
  // 先除后乘，降低中间值
  const result = Math.abs((a / g) * b);
  hooks.onResult?.(a, b, result);
  return result;
}

/** 多个数的 LCM（折叠）。 */
export function lcmAll(nums: readonly number[], hooks: LcmHooks = {}): number {
  if (nums.length === 0) throw new RangeError('nums must be non-empty');
  let result = Math.abs(nums[0]!);
  for (let i = 1; i < nums.length; i++) {
    result = lcm(result, nums[i]!, hooks);
  }
  return result;
}
