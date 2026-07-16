// 查找重复数（链环）· 纯算法实现
export interface Dup2Hooks {
  onStep?: (pos: number, who: 'slow' | 'fast') => void;
}

export function findDuplicate2(arr: readonly number[], hooks: Dup2Hooks = {}): number {
  let slow = arr[0]!,
    fast = arr[0]!;
  do {
    slow = arr[slow]!;
    fast = arr[arr[fast]!]!;
    hooks.onStep?.(slow, 'slow');
  } while (slow !== fast);
  slow = arr[0]!;
  while (slow !== fast) {
    slow = arr[slow]!;
    fast = arr[fast]!;
    hooks.onStep?.(slow, 'slow');
  }
  return slow;
}
