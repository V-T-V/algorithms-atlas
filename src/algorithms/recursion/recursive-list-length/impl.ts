// 递归链表长度 · 纯算法实现

export interface LlNode {
  value: number;
  next: LlNode | null;
}

export function buildList(values: readonly number[]): LlNode | null {
  if (values.length === 0) return null;
  const head: LlNode = { value: values[0]!, next: null };
  let cur = head;
  for (let i = 1; i < values.length; i++) {
    cur.next = { value: values[i]!, next: null };
    cur = cur.next;
  }
  return head;
}

/** 事件钩子。 */
export interface ListLengthHooks {
  onVisit?: (value: number, depth: number) => void;
  onBase?: (depth: number) => void;
  onReturn?: (count: number, depth: number) => void;
}

/**
 * 递归链表长度。
 */
export function listLength(
  head: LlNode | null,
  hooks: ListLengthHooks = {},
  depth: number = 0,
): number {
  if (head === null) {
    hooks.onBase?.(depth);
    return 0;
  }
  hooks.onVisit?.(head.value, depth);
  const rest = listLength(head.next, hooks, depth + 1);
  const len = 1 + rest;
  hooks.onReturn?.(len, depth);
  return len;
}
