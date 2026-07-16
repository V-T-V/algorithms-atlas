// =============================================================================
// 快乐数计数 · 纯算法实现
// =============================================================================

export interface HappyHooks {
  onCheck?: (n: number, isHappy: boolean) => void;
}

function digitSquareSum(n: number): number {
  let sum = 0;
  let x = n;
  while (x > 0) {
    const d = x % 10;
    sum += d * d;
    x = Math.floor(x / 10);
  }
  return sum;
}

/** 判定单个数是否快乐数。 */
export function isHappyNumber(n: number): boolean {
  if (n < 1) return false;
  let slow = n;
  let fast = n;
  do {
    slow = digitSquareSum(slow);
    fast = digitSquareSum(digitSquareSum(fast));
  } while (slow !== fast);
  return slow === 1;
}

/** 统计 1..n 中快乐数的个数。 */
export function countHappyNumbers(n: number, hooks: HappyHooks = {}): number {
  let count = 0;
  for (let i = 1; i <= n; i++) {
    const happy = isHappyNumber(i);
    if (happy) count++;
    hooks.onCheck?.(i, happy);
  }
  return count;
}
