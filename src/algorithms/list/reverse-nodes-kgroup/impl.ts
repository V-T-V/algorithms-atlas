// =============================================================================
// K 个一组反转链表（Reverse Nodes in k-Group）· 纯算法实现
// 每 k 个一段就地反转，不足 k 保持原序。零 DOM 依赖，可独立单测。
// =============================================================================

export interface ListNode {
  value: number;
  next: ListNode | null;
}

export interface ReverseKGroupHooks {
  /** 探测到从 tail 起还有 k 个节点（够分一组）。 */
  onGroupFound?: (groupStart: ListNode, k: number) => void;
  /** 剩余不足 k，保留原序结束。 */
  onShortTail?: (count: number, k: number) => void;
  /** 反转了一段 [segHead, segTail]。 */
  onGroupReversed?: (newSegHead: ListNode, newSegTail: ListNode) => void;
}

/** 从数组构建链表。 */
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

/** 拍平成数组。 */
export function toArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}

/**
 * 反转 [head, tail] 区间（不含 tail.next），返回新头新尾。
 * 仅翻转指针，O(k)。
 */
function reverseSegment(head: ListNode, tail: ListNode): [ListNode, ListNode] {
  let prev: ListNode | null = tail.next; // 反转后 head.next 应指向 tail 原本的 next
  let cur: ListNode | null = head;
  while (prev !== tail) {
    const next: ListNode | null = cur!.next;
    cur!.next = prev;
    prev = cur;
    cur = next;
  }
  return [tail, head];
}

/**
 * K 个一组反转链表。
 * 时间 O(n)，空间 O(1)。
 *
 * @param head 链表头
 * @param k 每组大小
 * @param hooks 可选事件钩子
 */
export function reverseKGroup(
  head: ListNode | null,
  k: number,
  hooks: ReverseKGroupHooks = {},
): ListNode | null {
  if (head === null || k <= 1) return head;

  const dummy: ListNode = { value: NaN, next: head };
  let prev: ListNode = dummy; // 上一段的尾（待衔接）

  while (prev.next !== null) {
    // 探测从 prev.next 起是否有 k 个
    let tail: ListNode | null = prev;
    let count = 0;
    while (tail !== null && count < k) {
      tail = tail.next;
      count++;
    }
    if (tail === null || count < k) {
      hooks.onShortTail?.(count, k);
      break; // 不足 k，结束
    }
    const segHead = prev.next!;
    hooks.onGroupFound?.(segHead, k);

    const nextSeg = tail.next; // 记录下一段起点
    const [newHead, newTail] = reverseSegment(segHead, tail);
    // 衔接
    prev.next = newHead;
    newTail.next = nextSeg;
    hooks.onGroupReversed?.(newHead, newTail);

    prev = newTail; // 下一轮的 prev 是当前反转后的尾
  }

  return dummy.next;
}
