// =============================================================================
// 链表栈 Linked List Stack · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：单链表 + 头插法。栈顶 = 链表头。push/pop/peek 均 O(1)。
// =============================================================================

/** 链表节点。 */
export interface StackNode {
  value: number;
  next: StackNode | null;
}

/** 栈操作过程中的事件钩子。任一可选。 */
export interface StackHooks {
  /** 压入一个值（新建头节点）。 */
  onPush?: (value: number) => void;
  /** 弹出栈顶值。 */
  onPop?: (value: number) => void;
  /** 查看栈顶（不弹出）。 */
  onPeek?: (value: number | undefined) => void;
}

/**
 * 链表栈：单链表头插法实现。
 * 栈顶始终是链表 head；push 在 head 前插入，pop 取走 head。
 */
export class LinkedListStack {
  private head: StackNode | null = null;
  private len = 0;

  /** 元素个数。 */
  get size(): number {
    return this.len;
  }

  /** 是否为空。 */
  isEmpty(): boolean {
    return this.head === null;
  }

  /** 查看栈顶（不弹出）。 */
  peek(): number | undefined {
    return this.head?.value;
  }

  /** 压栈：在链表头插入新节点。 */
  push(value: number, hooks: StackHooks = {}): void {
    this.head = { value, next: this.head };
    this.len++;
    hooks.onPush?.(value);
  }

  /** 弹栈：取走链表头节点并返回其值。空栈返回 undefined。 */
  pop(hooks: StackHooks = {}): number | undefined {
    if (this.head === null) return undefined;
    const v = this.head.value;
    this.head = this.head.next;
    this.len--;
    hooks.onPop?.(v);
    return v;
  }

  /** 从栈底到栈顶的值数组（用于断言/快照，不暴露内部节点）。 */
  toArray(): number[] {
    const out: number[] = [];
    let cur = this.head;
    while (cur) {
      out.unshift(cur.value); // head 是栈顶，放末尾
      cur = cur.next;
    }
    return out;
  }
}

/**
 * 便利函数：演示链表栈——把输入元素依次压栈，再依次弹栈（得到逆序）。
 * 驱动 trace / 测试用。返回弹出序列。
 */
export function linkedListStack(input: readonly number[], hooks: StackHooks = {}): number[] {
  const s = new LinkedListStack();
  for (const v of input) s.push(v, hooks);
  const out: number[] = [];
  while (!s.isEmpty()) {
    const v = s.pop(hooks);
    if (v !== undefined) out.push(v);
  }
  return out;
}
