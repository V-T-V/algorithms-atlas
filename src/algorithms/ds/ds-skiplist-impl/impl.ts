// =============================================================================
// 跳表
// =============================================================================

export interface SkipNode {
  value: number;
  forward: Array<SkipNode | null>; // forward[level]
}

export interface SkipListHooks {
  onInsert?: (value: number, level: number) => void;
  onSearch?: (value: number, found: boolean) => void;
}

const MAX_LEVEL = 16;
const P = 0.5;

function makeNode(value: number, level: number): SkipNode {
  return { value, forward: new Array<SkipNode | null>(level + 1).fill(null) };
}

// 去除 null：forward 直接用 SkipNode | null
export class SkipList {
  head: SkipNode;
  level = 0;
  size = 0;
  private rng: () => number;

  constructor(rng?: () => number) {
    this.head = makeNode(-Infinity, MAX_LEVEL);
    this.rng = rng ?? Math.random;
  }

  private randomLevel(): number {
    let lvl = 0;
    while (this.rng() < P && lvl < MAX_LEVEL) lvl++;
    return lvl;
  }

  insert(value: number, hooks: SkipListHooks = {}): void {
    const update: SkipNode[] = new Array(MAX_LEVEL + 1);
    let cur = this.head;
    for (let i = this.level; i >= 0; i--) {
      while (cur.forward[i] && cur.forward[i]!.value < value) cur = cur.forward[i]!;
      update[i] = cur;
    }
    cur = cur.forward[0]!;
    if (cur && cur.value === value) return; // 已存在
    const lvl = this.randomLevel();
    if (lvl > this.level) {
      for (let i = this.level + 1; i <= lvl; i++) update[i] = this.head;
      this.level = lvl;
    }
    const node = makeNode(value, lvl);
    for (let i = 0; i <= lvl; i++) {
      node.forward[i] = update[i]!.forward[i]!;
      update[i]!.forward[i] = node;
    }
    this.size++;
    hooks.onInsert?.(value, lvl);
  }

  search(value: number, hooks: SkipListHooks = {}): boolean {
    let cur = this.head;
    for (let i = this.level; i >= 0; i--) {
      while (cur.forward[i] && cur.forward[i]!.value < value) cur = cur.forward[i]!;
    }
    cur = cur.forward[0]!;
    const found = cur !== null && cur.value === value;
    hooks.onSearch?.(value, found);
    return found;
  }

  /** 返回底层所有节点（除头尾哨兵外） */
  values(): number[] {
    const out: number[] = [];
    let cur = this.head.forward[0];
    while (cur) {
      out.push(cur.value);
      cur = cur.forward[0];
    }
    return out;
  }
}
