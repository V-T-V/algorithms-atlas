// =============================================================================
// 回文链表 Palindrome List · 纯算法实现
// 快慢指针找中点 + 反转后半 + 逐节点比较。零 DOM 依赖，可独立单测。
// 通过 hooks 暴露每步操作供录制器使用。
// =============================================================================

/** 单链表节点。 */
export interface ListNode {
  value: number;
  next: ListNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PalindromeListHooks {
  /** 快慢指针各走一步。slowIdx/fastIdx 为节点序号。 */
  onStep?: (slowIdx: number, fastIdx: number) => void;
  /** 找到中点，准备反转后半段（起点 secondHalfIdx）。 */
  onMidpoint?: (secondHalfIdx: number) => void;
  /** 后半段反转完成（返回新后半头）。 */
  onReversed?: (secondHead: ListNode | null) => void;
  /** 比较前半与反转后半的对应节点。 */
  onCompare?: (leftIdx: number, rightIdx: number, equal: boolean) => void;
  /** 判定结果。 */
  onResult?: (isPalindrome: boolean) => void;
}

/** 从数值数组构建单链表。 */
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

/** 把链表拍平成数值数组。 */
export function listToArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}

/** 反转链表，返回新头。 */
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  while (curr !== null) {
    const next: ListNode | null = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

/** 统计链表长度。 */
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
 * 判断单链表是否回文。
 * 1) 快慢指针找中点（偶数时 slow 落在前半最后一个）
 * 2) 反转后半段
 * 3) 逐节点比较前半与反转后的后半
 * 时间 O(n)，空间 O(1)。
 */
export function palindromeList(head: ListNode | null, hooks: PalindromeListHooks = {}): boolean {
  if (head === null || head.next === null) {
    hooks.onResult?.(true);
    return true;
  }

  // 1. 快慢指针
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  let slowIdx = 0;
  let fastIdx = 0;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    slowIdx++;
    fastIdx = fast === null ? fastIdx : fastIdx + 2;
    hooks.onStep?.(slowIdx, fastIdx);
  }

  // 2. 反转后半段（从 slow 开始）
  hooks.onMidpoint?.(slowIdx);
  const secondHead = reverseList(slow);
  hooks.onReversed?.(secondHead);

  // 3. 比较
  let p: ListNode | null = head;
  let q: ListNode | null = secondHead;
  let li = 0;
  // 后半长度 = n - slowIdx；偶数时与前半等长
  const halfLen = lengthOf(secondHead);
  let isPalin = true;
  for (let i = 0; i < halfLen; i++) {
    const equal = p!.value === q!.value;
    hooks.onCompare?.(li, slowIdx + (halfLen - 1 - i), equal);
    if (!equal) isPalin = false;
    p = p!.next;
    q = q!.next;
    li++;
  }

  hooks.onResult?.(isPalin);
  return isPalin;
}
