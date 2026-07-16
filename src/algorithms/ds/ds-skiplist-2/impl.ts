// =============================================================================
// 跳表
// =============================================================================

interface SLNode {
  value: number;
  next: (SLNode | null)[];
}

export interface SkipListHooks {
  onLevel?: (level: number) => void;
  onInsert?: (value: number, levels: number) => void;
  onDone?: (size: number, maxLevel: number) => void;
}

export class SkipList2 {
  private head: SLNode;
  private level = 0;
  private size = 0;
  private readonly MAX_LEVEL = 16;
  private rngState = 12345;
  constructor(private hooks: SkipListHooks = {}) {
    this.head = { value: Number.NEGATIVE_INFINITY, next: new Array(this.MAX_LEVEL + 1).fill(null) };
  }
  private randomLevel(): number {
    let lvl = 0;
    while (this.rng() < 0.5 && lvl < this.MAX_LEVEL) lvl++;
    return lvl;
  }
  private rng(): number {
    // 简单 LCG 保证可复现
    this.rngState = (this.rngState * 1103515245 + 12345) & 0x7fffffff;
    return this.rngState / 0x7fffffff;
  }
  insert(v: number): void {
    const update: SLNode[] = new Array(this.MAX_LEVEL + 1).fill(this.head);
    let cur: SLNode | null = this.head;
    for (let l = this.level; l >= 0; l--) {
      while (cur!.next[l] && cur!.next[l]!.value < v) cur = cur!.next[l] ?? null;
      update[l] = cur!;
    }
    cur = cur!.next[0] ?? null;
    if (cur && cur.value === v) return;
    const lvl = this.randomLevel();
    if (lvl > this.level) {
      for (let l = this.level + 1; l <= lvl; l++) update[l] = this.head;
      this.level = lvl;
      this.hooks.onLevel?.(this.level);
    }
    const node: SLNode = { value: v, next: new Array(lvl + 1).fill(null) };
    for (let l = 0; l <= lvl; l++) {
      node.next[l] = update[l]!.next[l]!;
      update[l]!.next[l] = node;
    }
    this.size++;
    this.hooks.onInsert?.(v, lvl + 1);
  }
  contains(v: number): boolean {
    let cur: SLNode | null = this.head;
    for (let l = this.level; l >= 0; l--) {
      while (cur!.next[l] && cur!.next[l]!.value < v) cur = cur!.next[l] ?? null;
    }
    cur = cur!.next[0] ?? null;
    return cur !== null && cur.value === v;
  }
  get maxSize(): number {
    return this.size;
  }
  get maxLevel(): number {
    return this.level;
  }
  /** 取第 0 层的有序链表值。 */
  toArray(): number[] {
    const arr: number[] = [];
    let cur = this.head.next[0];
    while (cur) {
      arr.push(cur.value);
      cur = cur.next[0];
    }
    return arr;
  }
}
