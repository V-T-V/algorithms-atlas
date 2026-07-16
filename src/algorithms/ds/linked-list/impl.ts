// =============================================================================
// 单链表 Singly Linked List · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：head 指向首节点，每节点存 value + next(null 表尾)。
//   - 头插 insertHead O(1)；按下标定位 O(n)；按值查找 O(n)。
// =============================================================================

/** 链表节点。 */
export interface ListNode {
  value: number;
  next: ListNode | null;
}

/** 操作过程中的事件钩子。任一可选。 */
export interface LinkedListHooks {
  /** 在头部插入 value（新建节点成为新的 head）。 */
  onInsert?: (index: number, value: number) => void;
  /** 遍历时比较 cur 节点与目标（hit 表示匹配）。 */
  onCompare?: (index: number, value: number, hit: boolean) => void;
  /** 查找命中下标。 */
  onFound?: (index: number, value: number) => void;
  /** 删除指定下标的元素，返回被删值。 */
  onDelete?: (index: number, value: number) => void;
}

/**
 * 单链表（头插法构建）：head 指向首节点，尾节点 next 为 null。
 */
export class LinkedList {
  private head: ListNode | null = null;
  private len = 0;

  /** 元素个数。 */
  get size(): number {
    return this.len;
  }

  /** 是否为空。 */
  isEmpty(): boolean {
    return this.head === null;
  }

  /** 头插：新建节点成为新的 head。O(1)。 */
  insertHead(value: number, hooks: LinkedListHooks = {}): void {
    this.head = { value, next: this.head };
    this.len++;
    hooks.onInsert?.(0, value);
  }

  /** 尾插：遍历到末尾后追加。O(n)。 */
  insertTail(value: number, hooks: LinkedListHooks = {}): void {
    const node: ListNode = { value, next: null };
    if (this.head === null) {
      this.head = node;
    } else {
      let cur = this.head;
      while (cur.next !== null) cur = cur.next;
      cur.next = node;
    }
    this.len++;
    hooks.onInsert?.(this.len - 1, value);
  }

  /** 按值查找首个匹配的下标；未找到返回 -1。 */
  search(value: number, hooks: LinkedListHooks = {}): number {
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

  /** 删除首个等于 value 的节点。返回是否删除成功。 */
  delete(value: number, hooks: LinkedListHooks = {}): boolean {
    let cur = this.head;
    let prev: ListNode | null = null;
    let idx = 0;
    while (cur !== null) {
      const hit = cur.value === value;
      hooks.onCompare?.(idx, cur.value, hit);
      if (hit) {
        if (prev === null) this.head = cur.next;
        else prev.next = cur.next;
        this.len--;
        hooks.onDelete?.(idx, value);
        return true;
      }
      prev = cur;
      cur = cur.next;
      idx++;
    }
    return false;
  }

  /** 从头到尾的值数组（用于断言/快照）。 */
  toArray(): number[] {
    const out: number[] = [];
    let cur = this.head;
    while (cur !== null) {
      out.push(cur.value);
      cur = cur.next;
    }
    return out;
  }

  /** 是否包含 value。 */
  contains(value: number): boolean {
    return this.search(value) >= 0;
  }
}

/**
 * 便利函数：按顺序依次「头插」一组值，返回最终链表数组（逆序）。
 * 头插使得最后插入的元素排在最前，便于演示 next 指针的拼接过程。
 */
export function linkedList(values: readonly number[], hooks: LinkedListHooks = {}): number[] {
  const list = new LinkedList();
  for (const v of values) list.insertHead(v, hooks);
  return list.toArray();
}
