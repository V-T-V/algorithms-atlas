// Zobrist 哈希 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'zobrist-hashing-impl',
  categoryId: 'hashing',
  title: { zh: 'Zobrist 哈希（棋盘）', en: 'Zobrist Hashing (Board)' },
  summary: {
    zh: '为每个(棋子,格子)预置随机数，棋盘状态即所有占用项的异或和。',
    en: 'Pre-fill a random number per (piece, square); a board state is the XOR of all occupied entries.',
  },
  description: {
    zh: 'Zobrist 哈希由 Albert Zobrist 于 1970 年提出，是棋类程序（国际象棋、围棋、五子棋）增量哈希棋盘状态的标准方法。思路：为每个可能的「(棋子类型, 格子)」组合预先生成一个固定（但随机）的 64 位（或 32 位）数，存于二维表 Z[piece][square]。整个棋盘状态的哈希 = 所有被占用格子上对应随机数的按位异或（XOR）。关键性质是「增量可更新」：移动一枚棋子只需 XOR 掉旧位置、XOR 入新位置（XOR 的自反性），无需重新遍历全盘，O(1) 更新。这使置换表（transposition table，记录已搜索过的局面）能在博弈树搜索（Alpha-Beta、MCTS）中高效查重，避免重复计算。空棋盘哈希为 0。换边、王车易易位权等额外状态也可用独立随机数 XOR 表示。',
    en: 'Zobrist hashing, introduced by Albert Zobrist in 1970, is the standard way board-game engines (chess, go, gomoku) incrementally hash board states. The idea: pre-generate a fixed (but random) 64-bit (or 32-bit) number for every possible (piece type, square) combination, stored in a 2D table Z[piece][square]. The hash of the whole board state is the bitwise XOR of the random numbers for every occupied square. The key property is incremental updatability: moving a piece only requires XOR-ing out the old square and XOR-ing in the new one (XOR is self-inverse), in O(1) without re-scanning the board. This lets a transposition table (a cache of already-searched positions) detect duplicate states efficiently during game-tree search (alpha-beta, MCTS), avoiding recomputation. The empty board hashes to 0. Extra state such as side-to-move and castling rights can be represented by additional independent random numbers XOR-ed in.',
  },
  tags: ['hashing', 'xor', 'game-state', 'incremental'],
  complexity: { time: 'O(1) 增量 / O(cells) 全算', space: 'O(pieces·cells)' },
};
