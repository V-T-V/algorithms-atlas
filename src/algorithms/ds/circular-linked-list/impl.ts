// =============================================================================
// 循环链表 Circular Linked List · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：仅维护 tail 指针，tail.next 恒指向 head，形成环。
//   - 尾插 O(1)（由 tail 直接接上）；从 head 起遍历绕一圈回到 head。
// =============================================================================

/** 循环链表节点。 */
export interface CllNode {
  value: number;
  next: CllNode;
}

/** 操作过程中的事件钩子。任一可选。 */
export interface CircularLinkedListHooks {
  /** 尾插 value（新节点接在 tail 之后成为新 tail，并回指 head）。 */
  onInsert?: (value: number) => void;
  /** 遍历时访问某节点（绕环计数）。 */
  onVisit?: (step: number, value: number) => void;
  /** 摘除某节点（被删值）。 */
  onRemove?: (value: number) => void;
}

/**
 * 单向循环链表：仅维护 tail 指针，tail.next === head，构成首尾相连的环。
 */
export class CircularLinkedList {
  private tail: CllNode | null = null;
  private len = 0;

  /** 元素个数。 */
  get size(): number {
    return this.len;
  }

  /** 是否为空。 */
  isEmpty(): boolean {
    return this.tail === null;
  }

  /** 首元素值（head = tail.next）。 */
  headValue(): number | undefined {
    return this.tail === null ? undefined : this.tail.next.value;
  }

  /** 尾插 O(1)：新节点接在 tail 后，回指 head，并成为新 tail。 */
  insert(value: number, hooks: CircularLinkedListHooks = {}): void {
    const node: CllNode = { value, next: null as unknown as CllNode };
    if (this.tail === null) {
      node.next = node; // 自指成环
      this.tail = node;
    } else {
      node.next = this.tail.next; // 新节点先指向 head
      this.tail.next = node; // 旧 tail 接上新节点
      this.tail = node; // 新节点成为 tail
    }
    this.len++;
    hooks.onInsert?.(value);
  }

  /** 从 head 起绕环一周，按序返回所有值。 */
  toArray(): number[] {
    if (this.tail === null) return [];
    const out: number[] = [];
    let cur = this.tail.next; // head
    for (let i = 0; i < this.len; i++) {
      out.push(cur.value);
      cur = cur.next;
    }
    return out;
  }

  /**
   * 约瑟夫环（Josephus）：从 head 起每数到 step 移除当前节点，返回出环顺序。
   * step >= 1。空链表返回空数组。
   */
  josephus(step: number, hooks: CircularLinkedListHooks = {}): number[] {
    if (this.tail === null || step < 1) return [];
    const out: number[] = [];
    let prev = this.tail!; // prev.next === head
    let stepCount = 0;
    let total = 0;
    while (this.tail !== null) {
      const cur = prev.next;
      stepCount++;
      total++;
      hooks.onVisit?.(total, cur.value);
      if (stepCount === step) {
        // 摘除 cur
        prev.next = cur.next;
        out.push(cur.value);
        this.len--;
        hooks.onRemove?.(cur.value);
        // 若摘的是 tail，需更新 tail
        if (cur === this.tail) {
          if (this.len === 0) {
            this.tail = null;
          } else {
            this.tail = prev;
          }
        }
        stepCount = 0;
      } else {
        prev = cur;
      }
    }
    return out;
  }
}

/**
 * 便利函数：依次尾插构造循环链表，返回绕环一周的值数组（正序）。
 */
export function circularLinkedList(
  values: readonly number[],
  hooks: CircularLinkedListHooks = {},
): number[] {
  const list = new CircularLinkedList();
  for (const v of values) list.insert(v, hooks);
  return list.toArray();
}
