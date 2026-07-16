// =============================================================================
// 跳表（有序集合）· 纯算法实现
// =============================================================================

export interface SkipListHooks {
  onLevel?: (value: number, level: number) => void;
  onSearch?: (level: number, value: number) => void;
  onInsert?: (value: number) => void;
  onDelete?: (value: number) => void;
}

interface SkipNode {
  value: number;
  /** next[l] = 第 l 层的后继（null 表无后继）。 */
  next: (SkipNode | null)[];
  /** prev：最底层的直接前驱（便于双向遍历，可选）。 */
  prev: SkipNode | null;
}

const MAX_LEVEL = 16;
const P = 0.5;

export class SkipListSet {
  private head: SkipNode;
  private level = 1; // 当前最大使用层
  private count = 0;
  private hooks: SkipListHooks;

  constructor(hooks: SkipListHooks = {}) {
    this.hooks = hooks;
    this.head = { value: -Infinity, next: new Array(MAX_LEVEL).fill(null), prev: null };
  }

  get size(): number {
    return this.count;
  }

  private randomLevel(): number {
    let lvl = 1;
    while (Math.random() < P && lvl < MAX_LEVEL) lvl++;
    return lvl;
  }

  /** 查找 value 是否存在。 */
  search(value: number): boolean {
    const cur = this.findPred(value);
    const nxt = cur.next[0]!;
    return nxt !== null && nxt.value === value;
  }

  /** 返回底层链中第一个 >= value 的节点的前驱（用于插入/查找锚点）。 */
  private findPred(value: number): SkipNode {
    let cur = this.head;
    for (let l = this.level - 1; l >= 0; l--) {
      while (cur.next[l] !== null && cur.next[l]!.value < value) {
        cur = cur.next[l]!;
      }
      this.hooks.onSearch?.(l, value);
    }
    return cur;
  }

  insert(value: number): boolean {
    const update: SkipNode[] = new Array(MAX_LEVEL).fill(this.head);
    let cur = this.head;
    for (let l = this.level - 1; l >= 0; l--) {
      while (cur.next[l] !== null && cur.next[l]!.value < value) cur = cur.next[l]!;
      update[l] = cur;
    }
    const nxt = cur.next[0]!;
    if (nxt !== null && nxt.value === value) return false; // 已存在

    const lvl = this.randomLevel();
    if (lvl > this.level) {
      for (let l = this.level; l < lvl; l++) update[l] = this.head;
      this.level = lvl;
    }
    const node: SkipNode = { value, next: new Array(lvl).fill(null), prev: cur };
    for (let l = 0; l < lvl; l++) {
      node.next[l] = update[l]!.next[l]!;
      update[l]!.next[l] = node;
      this.hooks.onLevel?.(value, l);
    }
    // 维护底层前驱
    if (node.next[0] !== null) node.next[0]!.prev = node;
    this.count++;
    this.hooks.onInsert?.(value);
    return true;
  }

  delete(value: number): boolean {
    const update: SkipNode[] = new Array(MAX_LEVEL).fill(this.head);
    let cur = this.head;
    for (let l = this.level - 1; l >= 0; l--) {
      while (cur.next[l] !== null && cur.next[l]!.value < value) cur = cur.next[l]!;
      update[l] = cur;
    }
    const target = cur.next[0]!;
    if (target === null || target.value !== value) return false;
    for (let l = 0; l < this.level; l++) {
      if (update[l]!.next[l] !== target) break;
      update[l]!.next[l] = target.next[l]!;
    }
    if (target.next[0]! !== null) target.next[0]!.prev = target.prev;
    while (this.level > 1 && this.head.next[this.level - 1] === null) this.level--;
    this.count--;
    this.hooks.onDelete?.(value);
    return true;
  }

  /** 最小值。 */
  min(): number | undefined {
    return this.head.next[0]?.value;
  }

  /** 最大值。 */
  max(): number | undefined {
    if (this.count === 0) return undefined;
    // 利用底层前驱回溯（head.prev 在插入时未维护为尾，故改用遍历）
    let cur = this.head;
    for (let l = this.level - 1; l >= 0; l--) {
      while (cur.next[l] !== null) cur = cur.next[l]!;
    }
    return cur === this.head ? undefined : cur.value;
  }

  /** >= value 的最小元素。 */
  ceiling(value: number): number | undefined {
    const cur = this.findPred(value);
    const nxt = cur.next[0]!;
    return nxt === null ? undefined : nxt.value;
  }

  /** <= value 的最大元素。 */
  floor(value: number): number | undefined {
    const cur = this.findPred(value);
    const nxt = cur.next[0]!;
    if (nxt !== null && nxt.value === value) return nxt.value;
    // cur 是 < value 的最大节点
    return cur === this.head ? undefined : cur.value;
  }

  /** 中序遍历（升序）。 */
  toArray(): number[] {
    const out: number[] = [];
    let cur = this.head.next[0]!;
    while (cur !== null) {
      out.push(cur.value);
      cur = cur.next[0]!;
    }
    return out;
  }
}
