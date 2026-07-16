// =============================================================================
// 合并 K 个有序链表（Merge K Sorted Lists）· 纯算法实现
// 用最小堆（基于值比较的二叉堆）反复取出当前 K 个链表头中的最小节点。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每步操作供录制器使用。
// =============================================================================

/** 链表节点。 */
export interface ListNode {
  value: number;
  next: ListNode | null;
}

/** 由数组构造一条有序链表（演示输入用）。 */
export function fromArray(arr: readonly number[]): ListNode | null {
  const dummy: ListNode = { value: 0, next: null };
  let tail = dummy;
  for (const v of arr) {
    tail.next = { value: v, next: null };
    tail = tail.next;
  }
  return dummy.next;
}

/** 把链表拍平成数组（断言/单测用）。 */
export function toArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MergeKHooks {
  /** 初始化：把每条链表的头节点放入堆，给出当前堆规模。 */
  onInit?: (heapSize: number) => void;
  /** 从堆顶弹出最小节点（值 value，来自第 listIdx 条链表）。 */
  onPop?: (value: number, listIdx: number) => void;
  /** 弹出节点的链表前进一格，新头节点（值 nextValue 或 null 表示该链表耗尽）入堆。 */
  onAdvance?: (listIdx: number, nextValue: number | null) => void;
  /** 把 value 追加到合并结果末尾。 */
  onAppend?: (value: number, totalSoFar: number) => void;
}

/** 堆元素：链表头节点 + 所属链表下标。 */
interface HeapEntry {
  node: ListNode;
  listIdx: number;
}

/** 最小堆（按 node.value 比较）。下标 1-based 以简化父子计算。 */
class MinHeap {
  private readonly data: HeapEntry[] = [{} as HeapEntry]; // 占位 [0]
  get size(): number {
    return this.data.length - 1;
  }
  push(e: HeapEntry): void {
    this.data.push(e);
    this.siftUp(this.data.length - 1);
  }
  pop(): HeapEntry | undefined {
    if (this.size === 0) return undefined;
    const top = this.data[1]!;
    const last = this.data.pop()!;
    if (this.size > 0) {
      this.data[1] = last;
      this.siftDown(1);
    }
    return top;
  }
  private siftUp(i: number): void {
    let k = i;
    while (k > 1) {
      const parent = k >> 1;
      if (this.data[k]!.node.value < this.data[parent]!.node.value) {
        this.swap(k, parent);
        k = parent;
      } else break;
    }
  }
  private siftDown(i: number): void {
    const n = this.size;
    let k = i;
    for (;;) {
      const l = k << 1;
      const r = l + 1;
      let best = k;
      if (l <= n && this.data[l]!.node.value < this.data[best]!.node.value) best = l;
      if (r <= n && this.data[r]!.node.value < this.data[best]!.node.value) best = r;
      if (best === k) break;
      this.swap(k, best);
      k = best;
    }
  }
  private swap(a: number, b: number): void {
    const t = this.data[a]!;
    this.data[a] = this.data[b]!;
    this.data[b] = t;
  }
}

/**
 * 合并 K 个升序链表，返回一条合并后的升序链表。
 *
 * - 维护一个最小堆，初始放入每条非空链表的头节点。
 * - 反复弹出堆顶（全局最小），追加到结果；若该节点有 next，则把 next 入堆。
 * - 当堆空时所有链表耗尽，结束。
 *
 * @param lists K 条链表头（可为 null）
 * @param hooks 可选事件钩子
 * @returns 合并后的链表头（所有链表为空时返回 null）
 */
export function mergeKSorted(
  lists: ReadonlyArray<ListNode | null>,
  hooks: MergeKHooks = {},
): ListNode | null {
  const heap = new MinHeap();
  for (let i = 0; i < lists.length; i++) {
    const head = lists[i];
    if (head) heap.push({ node: head, listIdx: i });
  }
  hooks.onInit?.(heap.size);

  const dummy: ListNode = { value: 0, next: null };
  let tail = dummy;

  while (heap.size > 0) {
    const top = heap.pop()!;
    const { node, listIdx } = top;
    hooks.onPop?.(node.value, listIdx);

    // 链表前进
    const nxt = node.next;
    if (nxt) {
      heap.push({ node: nxt, listIdx });
      hooks.onAdvance?.(listIdx, nxt.value);
    } else {
      hooks.onAdvance?.(listIdx, null);
    }

    // 追加到结果
    node.next = null; // 断开原链表 next，避免结果被旧结构污染
    tail.next = node;
    tail = node;
    hooks.onAppend?.(node.value, 0);
  }

  return dummy.next;
}
