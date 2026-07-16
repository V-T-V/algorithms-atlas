// =============================================================================
// 随机化跳表（Randomized Skip List）· 纯算法实现
// 多层有序链表，每节点以概率 p 提升到上层。期望 O(log n) 搜索/插入/删除。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** 跳表节点：同一条记录可出现在多层，用 down 指针纵向连接。 */
export interface SkipNode {
  key: number;
  value: number;
  right?: SkipNode;
  down?: SkipNode;
}

/** 事件钩子。 */
export interface SkipListHooks {
  /** 随机决定新节点的高度（提升层数）。 */
  onRandomHeight?: (height: number) => void;
  /** 搜索/插入路径：在第 level 层比较 key。 */
  onCompare?: (level: number, key: number, nodeKey: number | undefined) => void;
  /** 插入完成后。 */
  onInsert?: (key: number, value: number, height: number) => void;
  /** 删除完成后。 */
  onDelete?: (key: number, removed: boolean) => void;
  /** 搜索完成。 */
  onSearch?: (key: number, found: boolean) => void;
}

/** 确定性 RNG（Mulberry32）。 */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SkipListOptions {
  /** 提升概率（默认 1/2）。 */
  p?: number;
  /** 最大层数（默认 16）。 */
  maxLevel?: number;
}

/**
 * 随机化跳表。
 */
export class SkipList {
  /** 每层最左的哑头节点（heads[level]，level=0 在底）。 */
  heads: SkipNode[] = [];
  readonly p: number;
  readonly maxLevel: number;
  private rng: Rng;
  private hooks: SkipListHooks;
  size = 0;

  constructor(rng: Rng = Math.random, options: SkipListOptions = {}, hooks: SkipListHooks = {}) {
    this.rng = rng;
    this.p = options.p ?? 0.5;
    this.maxLevel = options.maxLevel ?? 16;
    this.hooks = hooks;
    // 初始只有第 0 层（底层）
    this.heads = [{ key: -Infinity, value: 0 }];
  }

  /** 随机决定新节点高度（=提升次数+1，至少 1）。 */
  private randomHeight(): number {
    let h = 1;
    while (h < this.maxLevel && this.rng() < this.p) h++;
    this.hooks.onRandomHeight?.(h);
    return h;
  }

  /**
   * 在跳表中搜索 key。返回对应节点（最底层）或 undefined。
   */
  search(key: number): SkipNode | undefined {
    // 从最高层开始
    let level = this.heads.length - 1;
    let cur: SkipNode | undefined = this.heads[level]!;
    while (level >= 0 && cur) {
      // 在本层向右走到 right.key >= key
      while (cur.right && cur.right.key < key) {
        this.hooks.onCompare?.(level, key, cur.right.key);
        cur = cur.right;
      }
      this.hooks.onCompare?.(level, key, cur.right?.key);
      if (cur.right && cur.right.key === key) {
        // 下降到底层取值
        let node: SkipNode | undefined = cur.right;
        while (node && node.down) node = node.down;
        this.hooks.onSearch?.(key, true);
        return node;
      }
      // 下降一层
      cur = cur.down;
      level--;
    }
    this.hooks.onSearch?.(key, false);
    return undefined;
  }

  /**
   * 插入 (key, value)。若 key 已存在则更新 value。
   */
  insert(key: number, value: number): void {
    const height = this.randomHeight();
    // 扩展头节点到 height 层（若需要）
    // 不变量：heads[level].down === heads[level-1]（高层指向低层）。
    // 因此新增的（更高的）头节点其 down 应指向原最高头节点。
    while (this.heads.length < height) {
      const prevTop = this.heads[this.heads.length - 1]!;
      const newHead: SkipNode = { key: -Infinity, value: 0, down: prevTop };
      this.heads.push(newHead);
    }

    // 记录每层插入位置（的前驱）
    const update: (SkipNode | undefined)[] = new Array(height).fill(undefined);
    let level = this.heads.length - 1;
    let cur: SkipNode | undefined = this.heads[level]!;
    const foundAtBottom: SkipNode[] = [];

    while (level >= 0 && cur) {
      while (cur.right && cur.right.key < key) {
        this.hooks.onCompare?.(level, key, cur.right.key);
        cur = cur.right;
      }
      this.hooks.onCompare?.(level, key, cur.right?.key);
      // 若 key 已存在
      if (cur.right && cur.right.key === key) {
        foundAtBottom.push(cur.right);
      }
      // 若该 level 在新节点高度范围内，记录前驱
      if (level < height) {
        update[level] = cur;
      }
      cur = cur.down;
      level--;
    }

    // 若 key 已存在，更新所有层的值
    if (foundAtBottom.length > 0) {
      let node: SkipNode | undefined = foundAtBottom[0]!;
      while (node) {
        node.value = value;
        node = node.down;
      }
      this.hooks.onInsert?.(key, value, 0);
      return;
    }

    // 在 level 0..height-1 插入新节点。
    // 不变量：每个节点 .down 指向「下一层」（更低层）的同 key 节点。
    // 因此自底向上构建：新节点（较高层）.down = 上一轮插入的节点（较低层）。
    let prevInserted: SkipNode | undefined;
    for (let lv = 0; lv < height; lv++) {
      const pred = update[lv]!;
      const newNode: SkipNode = { key, value, right: pred.right, down: prevInserted };
      pred.right = newNode;
      prevInserted = newNode;
    }
    this.size++;
    this.hooks.onInsert?.(key, value, height);
  }

  /**
   * 删除 key。返回是否删除成功。
   */
  delete(key: number): boolean {
    let removed = false;
    let level = this.heads.length - 1;
    let cur: SkipNode | undefined = this.heads[level]!;
    while (level >= 0 && cur) {
      while (cur.right && cur.right.key < key) {
        this.hooks.onCompare?.(level, key, cur.right.key);
        cur = cur.right;
      }
      this.hooks.onCompare?.(level, key, cur.right?.key);
      if (cur.right && cur.right.key === key) {
        cur.right = cur.right.right; // 从本层摘除
        removed = true;
      }
      cur = cur.down;
      level--;
    }
    if (removed) this.size--;
    this.hooks.onDelete?.(key, removed);
    return removed;
  }

  /** 遍历底层有序键值对。 */
  toArray(): Array<{ key: number; value: number }> {
    const out: Array<{ key: number; value: number }> = [];
    let cur = this.heads[0]!.right;
    while (cur) {
      out.push({ key: cur.key, value: cur.value });
      cur = cur.right;
    }
    return out;
  }
}
