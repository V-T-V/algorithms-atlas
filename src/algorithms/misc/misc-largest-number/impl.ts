// =============================================================================
// 最大数 · 纯算法实现
// =============================================================================

export interface LargestNumberHooks {
  onCompare?: (a: string, b: string, order: string) => void;
  onResult?: (result: string) => void;
}

export function largestNumber(nums: readonly number[], hooks: LargestNumberHooks = {}): string {
  const strs = nums.map((n) => String(n));
  strs.sort((a, b) => {
    const ab = a + b;
    const ba = b + a;
    const order = ab > ba ? 'a,b' : 'b,a';
    hooks.onCompare?.(a, b, order);
    if (ab > ba) return -1;
    if (ab < ba) return 1;
    return 0;
  });
  // 全 0 处理
  if (strs.length > 0 && strs.every((s) => s === '0')) {
    hooks.onResult?.('0');
    return '0';
  }
  const result = strs.join('');
  hooks.onResult?.(result);
  return result;
}
