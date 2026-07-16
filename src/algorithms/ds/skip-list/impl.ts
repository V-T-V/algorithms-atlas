// =============================================================================
// 跳表 Skip List · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：多层有序链表 + 哨兵头/尾（头恒为 -∞）。随机层数用「固定种子」的 LCG，
//   保证 trace / 测试可复现。p = 1/2 的几何分布决定层数。
//   - search/insert/delete 期望 O(log n)；inorder O(n)。
// =============================================================================

/** 跳表节点（跨层）。 */
export interface SkipNode {
  value: number;
  /** forward[l] = 第 l 层的右邻居。 */
  forward: Array<SkipNode | null>;
}

/** 跳表执行过程中的事件钩子。任一可选。 */
export interface SkipListHooks {
  /** 比较：在第 level 层比较当前节点的值与 target。 */
  onCompare?: (level: number, nodeValue: number, target: number) => void;
  /** 新节点插入，位于 level+1 层（0-based，含）。 */
  onInsert?: (value: number, levels: number) => void;
  /** 找到目标节点。 */
  onFound?: (value: number, found: boolean) => void;
  /** 删除一个节点。 */
  onDelete?: (value: number) => void;
}

/** 固定种子的线性同余生成器（可复现）。 */
class LCG {
  private state: number;
  constructor(seed: number) {
    this.state = seed >>> 0;
  }
  /** 返回 [0,1)。 */
  next(): number {
    // Numerical Recipes 常数
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0;
    return this.state / 4294967296;
  }
}

const NEG_INF = Number.NEGATIVE_INFINITY;

/**
 * 跳表：支持插入、查找、删除（有序、去重）。
 */
export class SkipList {
  /** 最高层（0-based）。MAX 层上界。 */
  private readonly maxLevel: number;
  /** 当前最高已用层（0-based）。 */
  private level = 0;
  /** 头节点：所有层 forward 指向该层首节点。头值为 -∞。 */
  readonly head: SkipNode;
  private rng: LCG;
  /** 概率参数：节点出现在上一层的概率。 */
  private readonly p: number;

  constructor(opts: { maxLevel?: number; seed?: number; p?: number } = {}) {
    this.maxLevel = opts.maxLevel ?? 16;
    this.p = opts.p ?? 0.5;
    this.rng = new LCG(opts.seed ?? 1);
    this.head = { value: NEG_INF, forward: new Array(this.maxLevel + 1).fill(null) };
  }

  /** 元素个数。 */
  private count = 0;
  get size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  /** 随机生成新节点的层数（至少 0 层）。 */
  private randomLevel(): number {
    let lvl = 0;
    while (lvl < this.maxLevel && this.rng.next() < this.p) lvl++;
    return lvl;
  }

  /** 查找 value 是否存在。 */
  search(value: number, hooks: SkipListHooks = {}): boolean {
    let cur = this.head;
    for (let l = this.level; l >= 0; l--) {
      while (cur.forward[l] && cur.forward[l]!.value < value) {
        hooks.onCompare?.(l, cur.forward[l]!.value, value);
        cur = cur.forward[l]!;
      }
      if (cur.forward[l] && cur.forward[l]!.value === value) {
        hooks.onCompare?.(l, cur.forward[l]!.value, value);
      }
    }
    const found = cur.forward[0] != null && cur.forward[0]!.value === value;
    hooks.onFound?.(value, found);
    return found;
  }

  /** 插入 value（重复插入忽略，返回是否新增）。 */
  insert(value: number, hooks: SkipListHooks = {}): boolean {
    // update[l] = 插入位置在第 l 层的左邻居
    const update: SkipNode[] = new Array(this.maxLevel + 1).fill(this.head);
    let cur = this.head;
    for (let l = this.level; l >= 0; l--) {
      while (cur.forward[l] && cur.forward[l]!.value < value) {
        hooks.onCompare?.(l, cur.forward[l]!.value, value);
        cur = cur.forward[l]!;
      }
      update[l] = cur;
    }

    // 重复则忽略
    if (cur.forward[0] && cur.forward[0]!.value === value) {
      hooks.onFound?.(value, true);
      return false;
    }

    const lvl = this.randomLevel();
    if (lvl > this.level) {
      for (let l = this.level + 1; l <= lvl; l++) update[l] = this.head;
      this.level = lvl;
    }

    const node: SkipNode = { value, forward: new Array(lvl + 1).fill(null) };
    for (let l = 0; l <= lvl; l++) {
      node.forward[l] = update[l]!.forward[l] ?? null;
      update[l]!.forward[l] = node;
    }
    this.count++;
    hooks.onInsert?.(value, lvl + 1);
    return true;
  }

  /** 删除 value（不存在返回 false）。 */
  delete(value: number, hooks: SkipListHooks = {}): boolean {
    const update: SkipNode[] = new Array(this.maxLevel + 1).fill(this.head);
    let cur = this.head;
    for (let l = this.level; l >= 0; l--) {
      while (cur.forward[l] && cur.forward[l]!.value < value) {
        hooks.onCompare?.(l, cur.forward[l]!.value, value);
        cur = cur.forward[l]!;
      }
      update[l] = cur;
    }
    const target = cur.forward[0];
    if (!target || target.value !== value) {
      hooks.onFound?.(value, false);
      return false;
    }
    for (let l = 0; l <= this.level; l++) {
      if (update[l]!.forward[l] !== target) break;
      update[l]!.forward[l] = target.forward[l] ?? null;
    }
    // 降层
    while (this.level > 0 && this.head.forward[this.level] === null) this.level--;
    this.count--;
    hooks.onDelete?.(value);
    return true;
  }

  /** 升序遍历所有值。 */
  toArray(): number[] {
    const out: number[] = [];
    let cur = this.head.forward[0];
    while (cur) {
      out.push(cur.value);
      cur = cur.forward[0];
    }
    return out;
  }
}

/**
 * 便利函数：批量插入构建跳表，返回升序数组（驱动 trace/测试）。
 */
export function skipList(values: readonly number[], hooks: SkipListHooks = {}): number[] {
  const sl = new SkipList({ seed: 1 });
  for (const v of values) sl.insert(v, hooks);
  return sl.toArray();
}
