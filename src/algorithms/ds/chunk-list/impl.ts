// =============================================================================
// 块状链表 Chunk List · 纯算法实现（零 DOM 依赖，可独立单测）
// 实现：用链表串起若干「块」，每块是一个数组（容量约 √n）。
//   - 定位：沿链表累加块大小找到第 pos 个元素所在块
//   - 插入：在对应块的指定位置插入；块过大则分裂
//   - 删除：删对应块元素；块过空则与邻居合并
//   - 所有操作 O(√n)
// =============================================================================

/** 操作过程中的事件钩子。任一可选。 */
export interface ChunkListHooks {
  /** 初始化块链完成。 */
  onBuild?: (total: number, blockCount: number) => void;
  /** 开始在逻辑下标 pos 处插入值 v。 */
  onInsertStart?: (pos: number, v: number) => void;
  /** 开始删除逻辑下标 pos 处的元素。 */
  onEraseStart?: (pos: number) => void;
  /** 访问了某块（blockIdx）以定位。 */
  onVisitBlock?: (blockIdx: number, blockSize: number) => void;
  /** 在块 blockIdx 内的下标 slot 处改动。 */
  onModify?: (blockIdx: number, slot: number) => void;
  /** 块 blockIdx 被分裂为两个。 */
  onSplit?: (blockIdx: number) => void;
  /** 块 a 与相邻块 b 合并。 */
  onMerge?: (a: number, b: number) => void;
  /** 查询逻辑下标 pos 的值。 */
  onAt?: (pos: number, v: number) => void;
}

/** 链表的一个块。 */
interface Block {
  data: number[];
}

/**
 * 块状链表：支持任意位置 O(√n) 插入 / 删除 / 随机访问。
 */
export class ChunkList {
  private blocks: Block[] = [];
  /** 块大小上界（超过则分裂）。 */
  readonly blockCap: number;

  constructor(values: readonly number[] = [], hooks: ChunkListHooks = {}) {
    this.blockCap = Math.max(2, Math.floor(Math.sqrt(Math.max(1, values.length))));
    // 切成若干块
    for (let i = 0; i < values.length; i += this.blockCap) {
      this.blocks.push({ data: values.slice(i, i + this.blockCap) });
    }
    if (this.blocks.length === 0) this.blocks.push({ data: [] });
    hooks.onBuild?.(values.length, this.blocks.length);
  }

  /** 当前元素总数。 */
  size(): number {
    return this.blocks.reduce((s, b) => s + b.data.length, 0);
  }

  /** 块数量。 */
  blockCount(): number {
    return this.blocks.length;
  }

  /** 定位第 pos 个元素：返回 [blockIdx, 内部下标]。
   *  对访问/删除，pos ∈ [0, size-1]，p 严格小于某块长时命中该块。
   *  对插入，pos ∈ [0, size]，恰好在块边界（p===len）时归入下一块 slot 0，
   *  位于末尾时归入最后一块的尾部。 */
  private locate(pos: number, hooks: ChunkListHooks): [number, number] {
    let p = pos;
    for (let bi = 0; bi < this.blocks.length; bi++) {
      hooks.onVisitBlock?.(bi, this.blocks[bi]!.data.length);
      const len = this.blocks[bi]!.data.length;
      if (p < len) return [bi, p];
      p -= len;
    }
    // 落到末尾（pos === size 或最后一块边界）：归入最后一块的尾部 slot
    const last = this.blocks.length - 1;
    return [last, this.blocks[last]!.data.length];
  }

  /** 在逻辑下标 pos 处插入值 v。 */
  insert(pos: number, v: number, hooks: ChunkListHooks = {}): void {
    const n = this.size();
    const clamped = Math.max(0, Math.min(n, pos));
    hooks.onInsertStart?.(clamped, v);
    const [bi, slot] = this.locate(clamped, hooks);
    this.blocks[bi]!.data.splice(slot, 0, v);
    hooks.onModify?.(bi, slot);
    if (this.blocks[bi]!.data.length >= this.blockCap * 2) {
      this.splitBlock(bi, hooks);
    }
  }

  /** 删除逻辑下标 pos 处的元素，返回被删值。 */
  erase(pos: number, hooks: ChunkListHooks = {}): number | undefined {
    const n = this.size();
    if (pos < 0 || pos >= n) return undefined;
    hooks.onEraseStart?.(pos);
    const [bi, slot] = this.locate(pos, hooks);
    const removed = this.blocks[bi]!.data.splice(slot, 1)[0];
    hooks.onModify?.(bi, slot);
    // 块过空且非唯一块：与后继合并
    if (this.blocks.length > 1 && this.blocks[bi]!.data.length <= Math.floor(this.blockCap / 4)) {
      this.tryMerge(bi, hooks);
    }
    return removed;
  }

  /** 读取逻辑下标 pos 处的值。 */
  at(pos: number, hooks: ChunkListHooks = {}): number | undefined {
    if (pos < 0 || pos >= this.size()) return undefined;
    const [bi, slot] = this.locate(pos, hooks);
    const v = this.blocks[bi]!.data[slot]!;
    hooks.onAt?.(pos, v);
    return v;
  }

  /** 把块 bi 从中间分裂成两块。 */
  private splitBlock(bi: number, hooks: ChunkListHooks): void {
    const data = this.blocks[bi]!.data;
    const mid = data.length >> 1;
    const left = data.slice(0, mid);
    const right = data.slice(mid);
    this.blocks[bi]!.data = left;
    this.blocks.splice(bi + 1, 0, { data: right });
    hooks.onSplit?.(bi);
  }

  /** 把块 bi 与其后继合并。 */
  private tryMerge(bi: number, hooks: ChunkListHooks): void {
    if (bi + 1 >= this.blocks.length) return;
    const next = this.blocks[bi + 1]!;
    this.blocks[bi]!.data.push(...next.data);
    this.blocks.splice(bi + 1, 1);
    hooks.onMerge?.(bi, bi + 1);
    // 合并后可能又过大
    if (this.blocks[bi]!.data.length >= this.blockCap * 2) this.splitBlock(bi, hooks);
  }

  /** 展平为普通数组。 */
  toArray(): number[] {
    const out: number[] = [];
    for (const b of this.blocks) out.push(...b.data);
    return out;
  }

  /** 每个块的大小（供可视化）。 */
  blockSizes(): number[] {
    return this.blocks.map((b) => b.data.length);
  }
}

/**
 * 便利函数：按一串操作构建并执行，返回最终数组。
 * ops: [{op:'insert'|'erase'|'push', pos?, v?}]
 */
export function chunkList(
  input: {
    values: number[];
    ops: Array<{ op: 'insert' | 'erase' | 'push'; pos?: number; v?: number }>;
  },
  hooks: ChunkListHooks = {},
): number[] {
  const cl = new ChunkList(input.values, hooks);
  for (const o of input.ops) {
    if (o.op === 'push') cl.insert(cl.size(), o.v ?? 0, hooks);
    else if (o.op === 'insert') cl.insert(o.pos ?? 0, o.v ?? 0, hooks);
    else if (o.op === 'erase' && o.pos !== undefined) cl.erase(o.pos, hooks);
  }
  return cl.toArray();
}
