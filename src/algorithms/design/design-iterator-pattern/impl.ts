// 迭代器模式 · 实现
export interface IteratorHooks {
  onHasNext?: (hasNext: boolean) => void;
  onNext?: (value: number) => void;
}

export interface MyIterator<T> {
  hasNext(): boolean;
  next(): T;
}

class ListNode {
  constructor(
    public value: number,
    public next: ListNode | null = null,
  ) {}
}

export class LinkedList {
  private head: ListNode | null = null;
  private tail: ListNode | null = null;
  private sz = 0;

  push(v: number): void {
    const n = new ListNode(v);
    if (this.tail) this.tail.next = n;
    else this.head = n;
    this.tail = n;
    this.sz++;
  }

  get size(): number {
    return this.sz;
  }

  forwardIterator(hooks: IteratorHooks = {}): MyIterator<number> {
    let cur: ListNode | null = this.head;
    return {
      hasNext: () => cur !== null,
      next: () => {
        if (!cur) throw new Error('exhausted');
        const v = cur.value;
        hooks.onHasNext?.(cur.next !== null);
        hooks.onNext?.(v);
        cur = cur.next;
        return v;
      },
    };
  }

  reverseIterator(hooks: IteratorHooks = {}): MyIterator<number> {
    const arr: number[] = [];
    let cur = this.head;
    while (cur) {
      arr.push(cur.value);
      cur = cur.next;
    }
    let idx = arr.length - 1;
    return {
      hasNext: () => idx >= 0,
      next: () => {
        if (idx < 0) throw new Error('exhausted');
        const v = arr[idx]!;
        hooks.onHasNext?.(idx - 1 >= 0);
        hooks.onNext?.(v);
        idx--;
        return v;
      },
    };
  }
}
