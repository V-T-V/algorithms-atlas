// 拼接最大数 · 实现
export interface MaxNumHooks {
  onCompare?: (a: string, b: string, order: -1 | 1) => void;
  onConclude?: (result: string) => void;
}
export interface MaxNumResult {
  value: string;
}
export function greedyMaxNum2(nums: readonly number[], hooks: MaxNumHooks = {}): MaxNumResult {
  const strs = nums.map(String);
  strs.sort((a, b) => {
    const order = a + b > b + a ? -1 : 1;
    hooks.onCompare?.(a, b, order);
    return order;
  });
  let value = strs.join('');
  if (value[0] === '0') value = '0';
  hooks.onConclude?.(value);
  return { value };
}
