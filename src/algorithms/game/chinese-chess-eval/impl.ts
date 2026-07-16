// =============================================================================
// 中国象棋局面评估（Chinese Chess Evaluation）· 纯算法实现
// 子力 + 位置价值表（PST）。红方视角，正数红优。
// 棋盘：10 行(0..9) × 9 列(0..8)。红方在下（行号大），黑方在上（行号小）。
// =============================================================================

/** 棋子类型（大写=红，小写=黑）。 */
export type PieceChar =
  | 'K'
  | 'A'
  | 'E'
  | 'H'
  | 'R'
  | 'C'
  | 'P' // 红方：帅士相马车炮兵
  | 'k'
  | 'a'
  | 'e'
  | 'h'
  | 'r'
  | 'c'
  | 'p'; // 黑方：将士象马车炮卒

/** 棋盘：10 行 × 9 列，'.' 为空。 */
export type Board = string[][];

/** 子力基础价值（绝对值）。 */
export const MATERIAL_VALUE: Record<string, number> = {
  K: 10000,
  A: 200,
  E: 200,
  H: 400,
  R: 900,
  C: 450,
  P: 100,
};

/** 算法执行过程中的事件钩子。 */
export interface ChessEvalHooks {
  /** 扫描到 (r,c) 的棋子，给出其贡献（红为正/黑为负）。 */
  onPiece?: (r: number, c: number, piece: PieceChar, contribution: number) => void;
  /** 子力合计完成。 */
  onMaterial?: (red: number, black: number) => void;
  /** 位置价值合计完成。 */
  onPositional?: (red: number, black: number) => void;
  /** 最终得分。 */
  onScore?: (total: number) => void;
}

export interface EvalResult {
  /** 红方视角总分（正红优，负黑优）。 */
  score: number;
  /** 红方子力。 */
  redMaterial: number;
  /** 黑方子力。 */
  blackMaterial: number;
  /** 红方位置分。 */
  redPositional: number;
  /** 黑方位置分。 */
  blackPositional: number;
}

/** 判断是否红子。 */
function isRed(p: string): boolean {
  return p >= 'A' && p <= 'Z';
}

/** 是否过河兵/卒。红兵过河：r <= 4；黑卒过河：r >= 5。 */
function crossedRiver(p: PieceChar, r: number): boolean {
  if (p === 'P') return r <= 4;
  if (p === 'p') return r >= 5;
  return false;
}

/** 位置奖励：以棋子类型与坐标给出小奖励（演示版，非精确 PST）。 */
function positionalBonus(p: PieceChar, r: number, c: number): number {
  const centerCol = Math.abs(c - 4);
  const base = p.toUpperCase();
  switch (base) {
    case 'H': // 马：靠中心、不过河更灵活
      return 30 - centerCol * 5 + (r >= 2 && r <= 7 ? 10 : 0);
    case 'C': // 炮：中线略加成
      return 20 - centerCol * 3;
    case 'R': // 车：通畅加成（演示：固定）
      return 20 - centerCol * 2;
    case 'P': // 兵：过河翻倍加成
      return crossedRiver(p, r) ? 100 : 0;
    case 'K':
      return 0;
    default:
      return 5;
  }
}

/**
 * 评估中国象棋局面（红方视角）。
 *
 * @param board 10×9 棋盘
 * @param hooks 可选事件钩子
 */
export function evaluateBoard(board: Board, hooks: ChessEvalHooks = {}): EvalResult {
  let redMaterial = 0;
  let blackMaterial = 0;
  let redPositional = 0;
  let blackPositional = 0;

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r]!.length; c++) {
      const cell = board[r]![c]!;
      if (cell === '.' || cell === '') continue;
      const p = cell as PieceChar;
      const upper = p.toUpperCase();
      const mat = MATERIAL_VALUE[upper] ?? 0;
      const pos = positionalBonus(p, r, c);
      // 兵过河子力翻倍
      const effMat = upper === 'P' && crossedRiver(p, r) ? mat * 2 : mat;
      const contribution = (isRed(p) ? 1 : -1) * (effMat + pos);
      hooks.onPiece?.(r, c, p, contribution);
      if (isRed(p)) {
        redMaterial += effMat;
        redPositional += pos;
      } else {
        blackMaterial += effMat;
        blackPositional += pos;
      }
    }
  }
  hooks.onMaterial?.(redMaterial, blackMaterial);
  hooks.onPositional?.(redPositional, blackPositional);
  const score = redMaterial - blackMaterial + redPositional - blackPositional;
  hooks.onScore?.(score);
  return { score, redMaterial, blackMaterial, redPositional, blackPositional };
}

/** 生成初始局面（标准开局）。 */
export function initialBoard(): Board {
  const b: Board = Array.from({ length: 10 }, () => new Array<string>(9).fill('.'));
  // 黑方上排（r=0）：车马象士将士象马车
  const back = ['r', 'h', 'e', 'a', 'k', 'a', 'e', 'h', 'r'];
  for (let c = 0; c < 9; c++) b[0]![c] = back[c]!;
  // 黑炮（r=2，c=1,7）
  b[2]![1] = 'c';
  b[2]![7] = 'c';
  // 黑卒（r=3，c=0,2,4,6,8）
  for (const c of [0, 2, 4, 6, 8]) b[3]![c] = 'p';
  // 红兵（r=6）
  for (const c of [0, 2, 4, 6, 8]) b[6]![c] = 'P';
  // 红炮（r=7）
  b[7]![1] = 'C';
  b[7]![7] = 'C';
  // 红下排（r=9）
  const redBack = ['R', 'H', 'E', 'A', 'K', 'A', 'E', 'H', 'R'];
  for (let c = 0; c < 9; c++) b[9]![c] = redBack[c]!;
  return b;
}
