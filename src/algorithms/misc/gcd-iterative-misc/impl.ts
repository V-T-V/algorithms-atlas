// =============================================================================
// 迭代 GCD（欧几里得）· 纯算法实现
// while (b!==0) { [a,b]=[b,a%b] }。零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface GcdHooks {
  /** 每次迭代替换后（当前 a, b）。 */
  onStep?: (step: number, a: number, b: number) => void;
  /** 最终 GCD。 */
  onResult?: (gcd: number) => void;
}

/**
 * 迭代欧几里得算法求 GCD(a, b)。
 * 对负数取绝对值。结果非负。
 */
export function gcd(a: number, b: number, hooks: GcdHooks = {}): number {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new RangeError('a and b must be integers');
  }
  let x = Math.abs(a);
  let y = Math.abs(b);
  let step = 0;
  hooks.onStep?.(step, x, y);
  while (y !== 0) {
    const r = x % y;
    x = y;
    y = r;
    step++;
    hooks.onStep?.(step, x, y);
  }
  hooks.onResult?.(x);
  return x;
}

/** 多个数的 GCD（折叠）。 */
export function gcdAll(nums: readonly number[], hooks: GcdHooks = {}): number {
  if (nums.length === 0) throw new RangeError('nums must be non-empty');
  let g = Math.abs(nums[0]!);
  for (let i = 1; i < nums.length; i++) {
    g = gcd(g, nums[i]!, hooks);
  }
  return g;
}
