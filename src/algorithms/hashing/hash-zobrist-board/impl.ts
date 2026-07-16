// Zobrist 棋盘哈希 · 实现 (8x8 棋盘, 6 棋子类型)
export interface ZobHooks {
  onPlace?: (sq: number, piece: number) => void;
  onMove?: (from: number, to: number, piece: number, hash: bigint) => void;
}
const SIZE = 64,
  PIECES = 6;
let table: bigint[][] | null = null;
function getTable(): bigint[][] {
  if (table) return table;
  let s = 12345n;
  const rng = () => {
    s = (s * 1103515245n + 12345n) & 0x7fffffffffffffffn;
    return s;
  };
  table = Array.from({ length: SIZE }, () => Array.from({ length: PIECES }, () => rng()));
  return table;
}
export function zobristHash(board: ReadonlyArray<number>, hooks: ZobHooks = {}): bigint {
  const t = getTable();
  let h = 0n;
  for (let sq = 0; sq < board.length; sq++) {
    const p = board[sq]!;
    if (p >= 0) {
      h ^= t[sq]![p]!;
      hooks.onPlace?.(sq, p);
    }
  }
  return h;
}
export function zobristMove(
  hash: bigint,
  from: number,
  to: number,
  piece: number,
  hooks: ZobHooks = {},
): bigint {
  const t = getTable();
  const h = hash ^ t[from]![piece]! ^ t[to]![piece]!;
  hooks.onMove?.(from, to, piece, h);
  return h;
}
