// =============================================================================
// 双向链表 Doubly Linked List · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：每节点 prev + next，维护 head / tail 两个哨兵指针。
//   - 头插/尾插均 O(1)；删除任意节点 O(1)（若已知节点）。
// =============================================================================

/** 双向链表节点。 */
export interface DllNode {
  value: number;
  prev: DllNode | null;
  next: DllNode | null;
}

/** 操作过程中的事件钩子。任一可选。 */
export interface DoublyLinkedListHooks {
  /** 在头/尾插入 value（side 标方向）。 */
  onInsert?: (side: 'head' | 'tail', value: number) => void;
  /** 遍历时比较 cur 节点与目标（hit 表示匹配）。 */
  onCompare?: (index: number, value: number, hit: boolean) => void;
  /** 查找命中下标。 */
  onFound?: (index: number, value: number) => void;
  /** 删除指定下标的元素，返回被删值。 */
  onDelete?: (index: number, value: number) => void;
}

/**
 * 双向链表：每节点 prev + next，head/tail 各占一端。
 */
export class DoublyLinkedList {
  private head: DllNode | null = null;
  private tail: DllNode | null = null;
  private len = 0;

  /** 元素个数。 */
  get size(): number {
    return this.len;
  }

  /** 是否为空。 */
  isEmpty(): boolean {
    return this.head === null;
  }

  /** 头插：新节点成为新的 head。O(1)。 */
  insertHead(value: number, hooks: DoublyLinkedListHooks = {}): void {
    const node: DllNode = { value, prev: null, next: this.head };
    if (this.head === null) {
      this.head = this.tail = node;
    } else {
      this.head.prev = node;
      this.head = node;
    }
    this.len++;
    hooks.onInsert?.('head', value);
  }

  /** 尾插：新节点成为新的 tail。O(1)。 */
  insertTail(value: number, hooks: DoublyLinkedListHooks = {}): void {
    const node: DllNode = { value, prev: this.tail, next: null };
    if (this.tail === null) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.len++;
    hooks.onInsert?.('tail', value);
  }

  /** 从头遍历按值查找首个匹配下标；未找到返回 -1。 */
  search(value: number, hooks: DoublyLinkedListHooks = {}): number {
    let cur = this.head;
    let idx = 0;
    while (cur !== null) {
      const hit = cur.value === value;
      hooks.onCompare?.(idx, cur.value, hit);
      if (hit) {
        hooks.onFound?.(idx, value);
        return idx;
      }
      cur = cur.next;
      idx++;
    }
    return -1;
  }

  /** 删除首个等于 value 的节点（O(1) 摘链 + O(n) 定位）。返回是否成功。 */
  delete(value: number, hooks: DoublyLinkedListHooks = {}): boolean {
    let cur = this.head;
    let idx = 0;
    while (cur !== null) {
      const hit = cur.value === value;
      hooks.onCompare?.(idx, cur.value, hit);
      if (hit) {
        this.unlink(cur);
        hooks.onDelete?.(idx, value);
        return true;
      }
      cur = cur.next;
      idx++;
    }
    return false;
  }

  /** 摘除节点：拼接其 prev.next 与 next.prev。 */
  private unlink(node: DllNode): void {
    const { prev, next } = node;
    if (prev === null) this.head = next;
    else prev.next = next;
    if (next === null) this.tail = prev;
    else next.prev = prev;
    this.len--;
  }

  /** 从头到尾的值数组。 */
  toArray(): number[] {
    const out: number[] = [];
    let cur = this.head;
    while (cur !== null) {
      out.push(cur.value);
      cur = cur.next;
    }
    return out;
  }

  /** 从尾到头的值数组（反向遍历，验证 prev 链）。 */
  toArrayReverse(): number[] {
    const out: number[] = [];
    let cur = this.tail;
    while (cur !== null) {
      out.push(cur.value);
      cur = cur.prev;
    }
    return out;
  }
}

/**
 * 便利函数：依次尾插一组值，返回最终链表数组（正序）。
 */
export function doublyLinkedList(
  values: readonly number[],
  hooks: DoublyLinkedListHooks = {},
): number[] {
  const list = new DoublyLinkedList();
  for (const v of values) list.insertTail(v, hooks);
  return list.toArray();
}
