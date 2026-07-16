export interface RNode {
  value: number;
  next: RNode | null;
  random: RNode | null;
}
export interface CopyRandomHooks {
  onLink?: (v: number, rv: number | null) => void;
}
export function copyRandomList(head: RNode | null, hooks: CopyRandomHooks = {}): RNode | null {
  if (!head) return null;
  // 1. 插入拷贝
  let cur: RNode | null = head;
  while (cur) {
    const copy: RNode = { value: cur.value, next: cur.next, random: null };
    cur.next = copy;
    cur = copy.next;
  }
  // 2. 连 random
  cur = head;
  while (cur) {
    if (cur.random) cur.next!.random = cur.random.next;
    if (cur.random) hooks.onLink?.(cur.value, cur.random.next ? cur.random.next.value : null);
    cur = cur.next!.next;
  }
  // 3. 拆分
  const dummy: RNode = { value: NaN, next: null, random: null };
  let tail = dummy;
  cur = head;
  while (cur) {
    tail.next = cur.next!;
    tail = tail.next;
    cur.next = cur.next!.next;
    cur = cur.next;
  }
  return dummy.next;
}
