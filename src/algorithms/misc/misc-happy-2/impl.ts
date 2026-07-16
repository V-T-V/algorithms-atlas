// 快乐数 · 实现
function sqSum(n: number): number {
  let s = 0;
  while (n > 0) {
    const d = n % 10;
    s += d * d;
    n = Math.floor(n / 10);
  }
  return s;
}
export interface HappyHooks {
  onStep?: (n: number) => void;
  onConclude?: (happy: boolean) => void;
}
export function miscHappy2(n: number, hooks: HappyHooks = {}): boolean {
  let slow = n;
  let fast = sqSum(n);
  while (fast !== 1 && slow !== fast) {
    hooks.onStep?.(slow);
    slow = sqSum(slow);
    fast = sqSum(sqSum(fast));
  }
  const happy = fast === 1;
  hooks.onConclude?.(happy);
  return happy;
}
