// =============================================================================
// 两个链表的交集（Intersection of Two Arrays via Lists）· 纯算法实现
// 求两条链表（视为集合）的交集，结果去重升序。零 DOM 依赖，可独立单测。
// =============================================================================

/** 单链表节点。 */
export interface ListNode {
  value: number;
  next: ListNode | null;
}

/** 从数值数组构建单链表，返回头节点。 */
export function buildList(values: readonly number[]): ListNode | null {
  if (values.length === 0) return null;
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  for (const v of values) {
    tail.next = { value: v, next: null };
    tail = tail.next;
  }
  return dummy.next;
}

/** 把链表拍平成数值数组（便于断言）。 */
export function listToArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface IntersectionHooks {
  /** 比较两指针值，dir='a'|'b'|'both'。 */
  onCompare?: (va: number, vb: number, dir: 'a' | 'b' | 'both') => void;
  /** 计算完成。 */
  onDone?: (head: ListNode | null) => void;
}

/**
 * 求两条「升序」链表的交集（去重，升序）。
 * 双指针同步推进：相等则收录并各前进一步；不等则较小者前进。
 * 时间 O(m+n)，空间 O(结果数)。
 */
export function intersection(
  a: ListNode | null,
  b: ListNode | null,
  hooks: IntersectionHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  let pa: ListNode | null = a;
  let pb: ListNode | null = b;
  let lastTaken: number | null = null;
  while (pa !== null && pb !== null) {
    if (pa.value === pb.value) {
      hooks.onCompare?.(pa.value, pb.value, 'both');
      if (pa.value !== lastTaken) {
        tail.next = { value: pa.value, next: null };
        tail = tail.next;
        lastTaken = pa.value;
      }
      pa = pa.next;
      pb = pb.next;
    } else if (pa.value < pb.value) {
      hooks.onCompare?.(pa.value, pb.value, 'a');
      pa = pa.next;
    } else {
      hooks.onCompare?.(pa.value, pb.value, 'b');
      pb = pb.next;
    }
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
