// 递归数组求积 · 纯算法实现
export interface RecProdHooks {
  onRecurse?: (head: number, tailProd: number, total: number) => void;
  onResult?: (total: number) => void;
}

export function recProduct(arr: readonly number[], hooks: RecProdHooks = {}): number {
  if (arr.length === 0) return 1;
  const head = arr[0]!;
  const tailProd = recProduct(arr.slice(1), hooks);
  const total = head * tailProd;
  hooks.onRecurse?.(head, tailProd, total);
  return total;
}
