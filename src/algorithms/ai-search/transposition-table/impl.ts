// =============================================================================
// 置换表 / Zobrist 哈希 · 纯算法实现
// 提供 Zobrist 哈希增量工具 + 一个 alpha-beta 风格的置换表。
// 表项含 flag（EXACT / UPPER / LOWER），可与窗口配合做安全裁剪。
// =============================================================================

export type Rng = () => number;

/** 线性同余生成器（LCG），可复现随机源。 */
export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/** 把两个 32 位合成一个 53 位安全整数（JS 安全整数上限）。 */
function makeZobristKeys(cellCount: number, pieceKinds: number, rng: Rng): bigint[] {
  const keys: bigint[] = [];
  for (let i = 0; i < cellCount * pieceKinds; i++) {
    const hi = BigInt(Math.floor(rng() * 0x100000000)) << 32n;
    const lo = BigInt(Math.floor(rng() * 0x100000000));
    keys.push((hi | lo) & 0x1ffffffffffffn); // 53 位
  }
  return keys;
}

/** 项标志。 */
export type EntryFlag = 'EXACT' | 'UPPER_BOUND' | 'LOWER_BOUND';

export interface TtEntry {
  hash: bigint;
  depth: number;
  score: number;
  flag: EntryFlag;
  bestMove?: number;
}

export interface TtStats {
  stores: number;
  hits: number;
  misses: number;
}

/**
 * 置换表。用 Map<bigint, TtEntry> 存储，并提供 store/lookup 接口。
 * lookup 会按深度与 flag 判定该值是否可用：若条目深度 ≥ 查询深度，
 * 且 flag 与窗口兼容，则返回可用值。
 */
export class TranspositionTable {
  private readonly table = new Map<bigint, TtEntry>();
  readonly stats: TtStats = { stores: 0, hits: 0, misses: 0 };

  /** 表项数。 */
  get size(): number {
    return this.table.size;
  }

  /** 写入条目（相同 hash 仅保留更深的，深度相同则覆盖）。 */
  store(entry: TtEntry): void {
    const prev = this.table.get(entry.hash);
    if (prev !== undefined && prev.depth > entry.depth) {
      return; // 已有更深条目，保留
    }
    this.table.set(entry.hash, entry);
    this.stats.stores++;
  }

  /**
   * 查询。返回 {entry, usable, value?}：
   * usable 表示「在给定 [alpha,beta] 窗口与查询深度下，是否能直接用」。
   */
  lookup(
    hash: bigint,
    depth: number,
    alpha: number,
    beta: number,
  ): { entry?: TtEntry; usable: boolean; value?: number } {
    const entry = this.table.get(hash);
    if (entry === undefined) {
      this.stats.misses++;
      return { usable: false };
    }
    if (entry.depth < depth) {
      this.stats.misses++;
      return { entry, usable: false };
    }
    // 深度足够：按 flag 判定
    if (entry.flag === 'EXACT') {
      this.stats.hits++;
      return { entry, usable: true, value: entry.score };
    }
    if (entry.flag === 'LOWER_BOUND' && entry.score >= beta) {
      this.stats.hits++;
      return { entry, usable: true, value: entry.score };
    }
    if (entry.flag === 'UPPER_BOUND' && entry.score <= alpha) {
      this.stats.hits++;
      return { entry, usable: true, value: entry.score };
    }
    this.stats.misses++;
    return { entry, usable: false };
  }

  /** 清空。 */
  clear(): void {
    this.table.clear();
    this.stats.stores = 0;
    this.stats.hits = 0;
    this.stats.misses = 0;
  }
}

/**
 * Zobrist 哈希工具：维护一个棋盘的哈希，支持增量更新。
 */
export class Zobrist {
  readonly keys: bigint[];
  readonly cellCount: number;
  readonly pieceKinds: number;
  /** 当前哈希（外部读取用）。 */
  hash: bigint = 0n;

  constructor(cellCount: number, pieceKinds: number, seed: number = 12345) {
    this.cellCount = cellCount;
    this.pieceKinds = pieceKinds;
    this.keys = makeZobristKeys(cellCount, pieceKinds, makeLcg(seed));
  }

  private key(cell: number, piece: number): bigint {
    return this.keys[cell * this.pieceKinds + piece]!;
  }

  /** 从完整棋盘数组计算初始哈希（piece=0 表示空，跳过）。 */
  compute(board: number[]): bigint {
    let h = 0n;
    for (let i = 0; i < board.length; i++) {
      const p = board[i]!;
      if (p !== 0) h ^= this.key(i, p - 1);
    }
    this.hash = h;
    return h;
  }

  /**
   * 增量应用一步走法：
   * cell 上的棋子从 fromPiece → toPiece（fromPiece=0 表示空，toPiece=0 表示移除）。
   * 直接修改 this.hash。
   */
  apply(cell: number, fromPiece: number, toPiece: number): bigint {
    if (fromPiece !== 0) this.hash ^= this.key(cell, fromPiece - 1);
    if (toPiece !== 0) this.hash ^= this.key(cell, toPiece - 1);
    return this.hash;
  }
}
