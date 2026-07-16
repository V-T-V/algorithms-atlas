// Zobrist 国际象棋哈希 · 实现
const MASK64 = (1n << 64n) - 1n;

// 12 种棋子：0=白王 1=白后 2=白车 3=白象 4=白马 5=白兵
//            6=黑王 7=黑后 8=黑车 9=黑象 10=黑马 11=黑兵
const PIECES = 12;
const SQUARES = 64;

const ZN: bigint[][] = (() => {
  const t: bigint[][] = [];
  let s = 0x123456789abcdef0n;
  for (let p = 0; p < PIECES; p++) {
    const col: bigint[] = new Array(SQUARES);
    for (let sq = 0; sq < SQUARES; sq++) {
      s = (s * 6364136223846793005n + 1442695040888963407n) & MASK64;
      col[sq] = s;
    }
    t.push(col);
  }
  return t;
})();

// 棋盘：64 格，每格存 0..12（0 表示空，1..12 表示对应 ZN 索引+1）
export type Board = number[];

export interface ZobristHooks {
  onPiecePlace?: (piece: number, square: number, hash: bigint) => void;
  onMove?: (from: number, to: number, piece: number, captured: number | null, hash: bigint) => void;
  onResult?: (hash: bigint) => void;
}

export function zobristFromBoard(board: Board, hooks: ZobristHooks = {}): bigint {
  let h = 0n;
  for (let sq = 0; sq < SQUARES; sq++) {
    const v = board[sq];
    if (v !== undefined && v > 0) {
      h = (h ^ ZN[v - 1]![sq]!) & MASK64;
      hooks.onPiecePlace?.(v - 1, sq, h);
    }
  }
  hooks.onResult?.(h);
  return h;
}

// 增量：在棋盘上移动一枚棋子
export function zobristMove(
  prevHash: bigint,
  board: Board,
  from: number,
  to: number,
  hooks: ZobristHooks = {},
): bigint {
  const piece = board[from]; // 1..12
  if (!piece) return prevHash;
  const captured = board[to] && board[to]! > 0 ? board[to] : null;
  let h = prevHash;
  // 移除起点
  h = (h ^ ZN[piece - 1]![from]!) & MASK64;
  // 如有吃子，移除终点原棋子
  if (captured && captured > 0) h = (h ^ ZN[captured - 1]![to]!) & MASK64;
  // 加入终点
  h = (h ^ ZN[piece - 1]![to]!) & MASK64;
  // 更新棋盘
  board[to] = piece;
  board[from] = 0;
  hooks.onMove?.(from, to, piece - 1, captured && captured > 0 ? captured - 1 : null, h);
  hooks.onResult?.(h);
  return h;
}

// 字符串走法解析辅助：FEN 风格棋盘字符串到 Board
const FEN_MAP: Record<string, number> = {
  K: 1,
  Q: 2,
  R: 3,
  B: 4,
  N: 5,
  P: 6,
  k: 7,
  q: 8,
  r: 9,
  b: 10,
  n: 11,
  p: 12,
};
export function boardFromFenBoard(fenBoard: string): Board {
  const board: Board = new Array(SQUARES).fill(0);
  let idx = 0;
  for (const c of fenBoard) {
    if (c === '/') continue;
    const n = parseInt(c, 10);
    if (!isNaN(n)) {
      idx += n;
      continue;
    }
    if (FEN_MAP[c] !== undefined && idx < SQUARES) board[idx] = FEN_MAP[c]!;
    idx++;
  }
  return board;
}
