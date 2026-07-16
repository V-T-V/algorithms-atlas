// =============================================================================
// 链表相交（Intersection of Two Linked Lists）· 纯算法实现
// 两个单链表可能在某节点合并为同一尾部，求相交起点。零 DOM 依赖，可独立单测。
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

/** 构造两条在某节点相交的链表：listA=listAvals+shared，listB=listBvals+shared。返回 {headA, headB}。 */
export function buildIntersecting(
  listAvals: readonly number[],
  listBvals: readonly number[],
  shared: readonly number[],
): { headA: ListNode | null; headB: ListNode | null } {
  const sharedHead = buildList(shared);
  const headA = buildList(listAvals);
  const headB = buildList(listBvals);
  // 把 A、B 的尾接到 sharedHead
  const attach = (h: ListNode | null): void => {
    if (h === null) return;
    let t = h;
    while (t.next !== null) t = t.next;
    t.next = sharedHead;
  };
  attach(headA);
  attach(headB);
  return { headA, headB };
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface GetIntersectionHooks {
  /** 对齐后双指针各走一步。 */
  onStep?: (pa: ListNode | null, pb: ListNode | null) => void;
  /** 计算完成，给出相交节点（或 null）。 */
  onDone?: (intersect: ListNode | null) => void;
}

/** 链表长度。 */
function lengthOf(head: ListNode | null): number {
  let n = 0;
  let cur = head;
  while (cur) {
    n++;
    cur = cur.next;
  }
  return n;
}

/**
 * 求两条单链表的相交节点（按引用相等）。
 * 先对齐长度，再同步前进比较引用。
 * 时间 O(m+n)，空间 O(1)。
 */
export function getIntersection(
  headA: ListNode | null,
  headB: ListNode | null,
  hooks: GetIntersectionHooks = {},
): ListNode | null {
  const lenA = lengthOf(headA);
  const lenB = lengthOf(headB);
  let pa: ListNode | null = headA;
  let pb: ListNode | null = headB;
  // 长的先走 |lenA-lenB| 步
  const diff = Math.abs(lenA - lenB);
  for (let i = 0; i < diff; i++) {
    if (lenA > lenB) pa = pa!.next;
    else pb = pb!.next;
  }
  while (pa !== null && pb !== null) {
    hooks.onStep?.(pa, pb);
    if (pa === pb) {
      hooks.onDone?.(pa);
      return pa;
    }
    pa = pa.next;
    pb = pb.next;
  }
  hooks.onDone?.(null);
  return null;
}
