// =============================================================================
// Zobrist 哈希（棋盘）· 录制帧序列
// 在 4x4 棋盘上演示：初始放置 → 增量移动。用 setGrid 展示棋盘，setAux 展示哈希。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ZobristHash, type ZobristHooks } from './impl.ts';

export const DEFAULT_INPUT: {
  rows: number;
  cols: number;
  numPieces: number;
  board: number[][];
  moves: Array<{ fr: number; fc: number; tr: number; tc: number; piece: number }>;
} = {
  rows: 4,
  cols: 4,
  numPieces: 3, // 0=空, 1=●, 2=○
  board: [
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 0, 1],
  ],
  moves: [
    { fr: 0, fc: 1, tr: 1, tc: 1, piece: 1 }, // ● 右下移
    { fr: 2, fc: 2, tr: 3, tc: 2, piece: 2 }, // ○ 下移
  ],
};

const PIECE_LABEL = ['', '●', '○'];

function renderBoard(
  board: number[][],
  highlight: Array<{ r: number; c: number; role: BarRole }>,
): { cells: Array<Array<{ v: string | number; role: BarRole }>> } {
  const roleAt = (r: number, c: number): BarRole => {
    for (const h of highlight) if (h.r === r && h.c === c) return h.role;
    return 'default';
  };
  const cells = board.map((row, r) =>
    row.map((piece, c) => ({
      v: piece === 0 ? '·' : (PIECE_LABEL[piece] ?? String(piece)),
      role: roleAt(r, c),
    })),
  );
  return { cells };
}

function hex8(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

/** 录制演示帧序列。 */
export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { rows, cols, numPieces, board: initialBoard, moves } = input;
  // 深拷贝棋盘，避免修改输入
  const board = initialBoard.map((row) => [...row]);
  const zh = new ZobristHash(rows, cols, numPieces);

  const snapshot = (
    note: { zh: string; en: string },
    highlight: Array<{ r: number; c: number; role: BarRole }>,
    hash: number,
    extra: Array<{ label: string; value: string; role?: BarRole }> = [],
  ): void => {
    const { cells } = renderBoard(board, highlight);
    rec
      .begin(note)
      .setGrid(cells)
      .setAux([
        { label: '棋盘哈希', value: hex8(hash), role: 'pivot' as BarRole },
        { label: '十进制', value: String(hash >>> 0), role: 'default' as BarRole },
        ...extra,
      ])
      .commit();
  };

  snapshot(
    {
      zh: `空棋盘 ${rows}×${cols}，哈希 = 0。开始放置初始棋子。`,
      en: `Empty board ${rows}×${cols}, hash = 0. Placing initial pieces.`,
    },
    [],
    0,
  );

  const hooks: ZobristHooks = {
    onInit: (hash) => {
      const occupied: Array<{ r: number; c: number; role: BarRole }> = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (board[r]![c]! > 0) occupied.push({ r, c, role: 'final' as BarRole });
        }
      }
      snapshot(
        {
          zh: `初始局面：异或所有占用格的随机数 → 哈希 = ${hex8(hash)}`,
          en: `Initial position: XOR all occupied squares' randoms → hash = ${hex8(hash)}`,
        },
        occupied,
        hash,
      );
    },
  };

  zh.computeFromBoard(board, hooks);

  // 增量移动演示
  for (const m of moves) {
    const before = zh.hash;
    // 移除旧位置（更新棋盘视图）
    board[m.fr]![m.fc] = 0;
    snapshot(
      {
        zh: `移动 ${PIECE_LABEL[m.piece]}：从 (${m.fr},${m.fc}) 移除 → XOR 掉旧随机数`,
        en: `Move ${PIECE_LABEL[m.piece]}: remove from (${m.fr},${m.fc}) → XOR out old random`,
      },
      [
        { r: m.fr, c: m.fc, role: 'warn' as BarRole },
        { r: m.tr, c: m.tc, role: 'swap' as BarRole },
      ],
      zh.hash,
      [{ label: '移动前哈希', value: hex8(before), role: 'compare' as BarRole }],
    );
    // 放置新位置
    board[m.tr]![m.tc] = m.piece;
    zh.togglePiece(m.fr, m.fc, m.piece);
    zh.togglePiece(m.tr, m.tc, m.piece);
    snapshot(
      {
        zh: `放置到 (${m.tr},${m.tc}) → XOR 入新随机数。增量更新后哈希 = ${hex8(zh.hash)}`,
        en: `Place at (${m.tr},${m.tc}) → XOR in new random. Incremental hash = ${hex8(zh.hash)}`,
      },
      [
        { r: m.tr, c: m.tc, role: 'final' as BarRole },
        { r: m.fr, c: m.fc, role: 'default' as BarRole },
      ],
      zh.hash,
      [{ label: '移动前哈希', value: hex8(before), role: 'compare' as BarRole }],
    );
  }

  // 终态
  const occupied: Array<{ r: number; c: number; role: BarRole }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r]![c]! > 0) occupied.push({ r, c, role: 'final' as BarRole });
    }
  }
  snapshot(
    {
      zh: `终局。最终哈希 = ${hex8(zh.hash)}（每步增量更新，无需全盘重算）`,
      en: `Final position. Hash = ${hex8(zh.hash)} (incremental per step, no full rescan)`,
    },
    occupied,
    zh.hash,
  );

  return rec.build();
}
