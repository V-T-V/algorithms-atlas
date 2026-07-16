// =============================================================================
// 链式队列 Queue (Linked) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：单链表 + head/front 与 rear/tail 两指针。
//   - 入队：tail 后接新节点 O(1)；出队：取走 head O(1)。两端均无搬移。
// =============================================================================

/** 队列节点。 */
export interface QueueNode {
  value: number;
  next: QueueNode | null;
}

/** 操作过程中的事件钩子。任一可选。 */
export interface QueueLinkedHooks {
  /** 入队：value 接到队尾。 */
  onEnqueue?: (value: number) => void;
  /** 出队：取走队首 value。 */
  onDequeue?: (value: number) => void;
}

/**
 * 链式队列：单链表 + front(head) / rear(tail) 两指针。
 * 入队接在 tail 之后，出队取走 head，均 O(1)。
 */
export class QueueLinked {
  private front: QueueNode | null = null;
  private rear: QueueNode | null = null;
  private len = 0;

  /** 元素个数。 */
  get size(): number {
    return this.len;
  }

  /** 是否为空。 */
  isEmpty(): boolean {
    return this.front === null;
  }

  /** 查看队首（不取出）。 */
  peek(): number | undefined {
    return this.front === null ? undefined : this.front.value;
  }

  /** 入队 O(1)：新节点接在 tail 之后（空队时同时成为 front 与 rear）。 */
  enqueue(value: number, hooks: QueueLinkedHooks = {}): void {
    const node: QueueNode = { value, next: null };
    if (this.rear === null) {
      this.front = this.rear = node;
    } else {
      this.rear.next = node;
      this.rear = node;
    }
    this.len++;
    hooks.onEnqueue?.(value);
  }

  /** 出队 O(1)：取走 front 节点。空队返回 undefined。 */
  dequeue(hooks: QueueLinkedHooks = {}): number | undefined {
    if (this.front === null) return undefined;
    const v = this.front.value;
    this.front = this.front.next;
    if (this.front === null) this.rear = null; // 取空后 rear 也要清
    this.len--;
    hooks.onDequeue?.(v);
    return v;
  }

  /** 队首→队尾 的值数组。 */
  toArray(): number[] {
    const out: number[] = [];
    let cur = this.front;
    while (cur !== null) {
      out.push(cur.value);
      cur = cur.next;
    }
    return out;
  }
}

/**
 * 便利函数：依次入队再全部出队，返回出队序列（FIFO 正序）。
 */
export function queueLinked(values: readonly number[], hooks: QueueLinkedHooks = {}): number[] {
  const q = new QueueLinked();
  for (const v of values) q.enqueue(v, hooks);
  const out: number[] = [];
  while (!q.isEmpty()) out.push(q.dequeue(hooks)!);
  return out;
}
