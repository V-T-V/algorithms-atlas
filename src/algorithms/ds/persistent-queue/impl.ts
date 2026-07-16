// =============================================================================
// 可持久化队列（Persistent Queue）· 纯算法实现
// 用两个持久化（不可变）栈表示队列，每次操作返回新版本。零 DOM 依赖，可独立单测。
// =============================================================================

/** 持久化栈节点（不可变）。 */
export interface PStackNode {
  readonly value: number;
  readonly next: PStackNode | null;
  readonly size: number;
}
export type PStack = PStackNode | null;

export interface PersistentQueueHooks {
  onEnqueue?: (version: number, value: number) => void;
  onDequeue?: (version: number, value: number, newVersion: number) => void;
  onReverse?: (count: number) => void;
}

/** 持久化栈操作。 */
const empty: PStack = null;
function push(stack: PStack, value: number): PStackNode {
  return { value, next: stack, size: (stack?.size ?? 0) + 1 };
}
function top(stack: PStack): number | null {
  return stack === null ? null : stack.value;
}
function pop(stack: PStack): PStack {
  return stack === null ? null : stack.next;
}
function sizeOf(stack: PStack): number {
  return stack?.size ?? 0;
}

/** 把一个栈反转后接到另一栈顶（持久化）。用于 back→front 倾倒。 */
function reverseOnto(src: PStack, dst: PStack): PStack {
  let s = src;
  let d = dst;
  while (s !== null) {
    d = push(d, s.value);
    s = s.next;
  }
  return d;
}

/** 可持久化队列（不可变）。 */
export class PersistentQueue {
  readonly front: PStack;
  readonly back: PStack;
  readonly length: number;

  private constructor(front: PStack, back: PStack) {
    this.front = front;
    this.back = back;
    this.length = sizeOf(front) + sizeOf(back);
  }

  static empty(): PersistentQueue {
    return new PersistentQueue(empty, empty);
  }

  /** 入队：push 到 back，返回新版本。 */
  enqueue(value: number, hooks: PersistentQueueHooks = {}, version = 0): PersistentQueue {
    const q = new PersistentQueue(this.front, push(this.back, value));
    hooks.onEnqueue?.(version, value);
    return q;
  }

  /** 出队：若 front 空则先倾倒 back→front；返回 { value, rest }。空返回 null。 */
  dequeue(
    hooks: PersistentQueueHooks = {},
    version = 0,
  ): { value: number; rest: PersistentQueue } | null {
    if (this.length === 0) return null;
    let front = this.front;
    let back = this.back;
    if (front === null) {
      // 倾倒 back → front（反转）
      hooks.onReverse?.(sizeOf(back));
      front = reverseOnto(back, empty);
      back = empty;
    }
    const v = top(front)!;
    const rest = new PersistentQueue(pop(front), back);
    hooks.onDequeue?.(version, v, version + 1);
    return { value: v, rest };
  }

  /** 查看队首（不移除）。 */
  peek(): number | null {
    if (this.length === 0) return null;
    if (this.front !== null) return top(this.front);
    // front 空，队首是 back 的最底（最后入队的反向）
    let s: PStack = this.back;
    let bottom: number | null = null;
    while (s !== null) {
      bottom = s.value;
      s = s.next;
    }
    return bottom;
  }

  /** 转数组（front 栈顶→back 栈底）。 */
  toArray(): number[] {
    const out: number[] = [];
    let s: PStack = this.front;
    while (s !== null) {
      out.push(s.value);
      s = s.next;
    }
    // back 需反转（栈顶是最后入队的）
    const backArr: number[] = [];
    s = this.back;
    while (s !== null) {
      backArr.push(s.value);
      s = s.next;
    }
    backArr.reverse();
    out.push(...backArr);
    return out;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }
}
