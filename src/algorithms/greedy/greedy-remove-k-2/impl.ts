// 移掉 K 位数字 · 实现
export interface RemoveKHooks {
  onPop?: (popped: string) => void;
  onPush?: (pushed: string) => void;
  onConclude?: (result: string) => void;
}
export interface RemoveKResult {
  value: string;
}
export function greedyRemoveK2(num: string, k: number, hooks: RemoveKHooks = {}): RemoveKResult {
  const stack: string[] = [];
  let removed = 0;
  for (const ch of num) {
    while (removed < k && stack.length > 0 && stack[stack.length - 1]! > ch) {
      const popped = stack.pop()!;
      hooks.onPop?.(popped);
      removed++;
    }
    stack.push(ch);
    hooks.onPush?.(ch);
  }
  while (removed < k) {
    const popped = stack.pop()!;
    hooks.onPop?.(popped);
    removed++;
  }
  let value = stack.join('').replace(/^0+/, '');
  if (value === '') value = '0';
  hooks.onConclude?.(value);
  return { value };
}
