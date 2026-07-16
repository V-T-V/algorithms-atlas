export interface MNode {
  value: number;
  next: MNode | null;
  prev: MNode | null;
  child: MNode | null;
}
export interface FlattenHooks {
  onInsert?: (parent: number, child: number) => void;
}
export function flatten(head: MNode | null, hooks: FlattenHooks = {}): MNode | null {
  if (!head) return null;
  let cur: MNode | null = head;
  while (cur) {
    if (cur.child) {
      const next = cur.next;
      const c: MNode | null = cur.child;
      hooks.onInsert?.(cur.value, c!.value);
      cur.next = c;
      c.prev = cur;
      cur.child = null;
      let tail = c;
      while (tail.next) tail = tail.next;
      tail.next = next;
      if (next) next.prev = tail;
    }
    cur = cur.next;
  }
  return head;
}
