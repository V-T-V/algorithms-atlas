// =============================================================================
// Zobrist 哈希（棋盘）· 纯算法实现
// 为每个 (piece, square) 预置随机数，状态 = 占用项的异或和。支持 O(1) 增量更新。
// =============================================================================

/** 事件钩子。 */
export interface ZobristHooks {
  /** 计算初始哈希（遍历棋盘）后。 */
  onInit?: (hash: number) => void;
  /** 增量更新：在 (row,col) 处 放置/移除 一个棋子后的新哈希。 */
  onToggle?: (row: number, col: number, piece: number, hash: number) => void;
  /** 移动一枚棋子后的新哈希。 */
  onMove?: (fromRow: number, fromCol: number, toRow: number, toCol: number, hash: number) => void;
}

/**
 * 32 位 Zobrist 哈希器。
 * piece: 非负整数（棋子类型 id）；square 由 (row, col) 映射到 0..rows*cols-1。
 */
export class ZobristHash {
  readonly rows: number;
  readonly cols: number;
  readonly numPieces: number;
  /** table[piece][square]：随机数。 */
  readonly table: number[][];
  /** 当前棋盘哈希。 */
  hash: number;

  /**
   * @param rows 行数
   * @param cols 列数
   * @param numPieces 棋子类型数（含空位 0 与各类棋子）
   * @param rng 可选随机数生成器（默认用 mulberry32 固定种子以保证可复现）
   */
  constructor(rows: number, cols: number, numPieces: number, rng?: () => number) {
    if (rows <= 0 || cols <= 0 || numPieces <= 0) {
      throw new RangeError('rows/cols/numPieces must be positive');
    }
    this.rows = rows;
    this.cols = cols;
    this.numPieces = numPieces;
    const rand = rng ?? mulberry32(0x9e3779b9);
    const cells = rows * cols;
    this.table = [];
    for (let p = 0; p < numPieces; p++) {
      const row: number[] = [];
      for (let s = 0; s < cells; s++) row.push(Math.floor(rand() * 0x100000000) >>> 0);
      this.table.push(row);
    }
    this.hash = 0;
  }

  /** 从给定棋盘二维数组计算初始哈希。board[r][c] = piece id（0 表示空，跳过）。 */
  computeFromBoard(board: number[][], hooks: ZobristHooks = {}): number {
    let h = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const piece = board[r]?.[c] ?? 0;
        if (piece > 0) {
          h = (h ^ this.randomFor(piece, r, c)) >>> 0;
        }
      }
    }
    this.hash = h >>> 0;
    hooks.onInit?.(this.hash);
    return this.hash;
  }

  /** 在 (row,col) 处切换一个棋子（XOR：放置或移除，自反）。 */
  togglePiece(row: number, col: number, piece: number, hooks: ZobristHooks = {}): number {
    if (piece <= 0) return this.hash;
    this.hash = (this.hash ^ this.randomFor(piece, row, col)) >>> 0;
    hooks.onToggle?.(row, col, piece, this.hash);
    return this.hash;
  }

  /** 放置一个棋子（XOR）。 */
  placePiece(row: number, col: number, piece: number, hooks: ZobristHooks = {}): number {
    return this.togglePiece(row, col, piece, hooks);
  }

  /** 移除一个棋子（XOR）。 */
  removePiece(row: number, col: number, piece: number, hooks: ZobristHooks = {}): number {
    return this.togglePiece(row, col, piece, hooks);
  }

  /** 移动一枚棋子：从 (fr,fc) 移到 (tr,tc)。 */
  movePiece(
    fr: number,
    fc: number,
    tr: number,
    tc: number,
    piece: number,
    hooks: ZobristHooks = {},
  ): number {
    this.togglePiece(fr, fc, piece); // 移除旧位置
    this.togglePiece(tr, tc, piece); // 放置新位置
    hooks.onMove?.(fr, fc, tr, tc, this.hash);
    return this.hash;
  }

  /** 取 (piece, row, col) 对应的随机数。 */
  randomFor(piece: number, row: number, col: number): number {
    if (piece < 0 || piece >= this.numPieces) throw new RangeError('piece out of range');
    const s = row * this.cols + col;
    return this.table[piece]![s]!;
  }

  /** 重置为空盘哈希（0）。 */
  reset(): void {
    this.hash = 0;
  }
}

/** mulberry32：确定性 PRNG（种子固定 → 随机数表可复现）。 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function (): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}
