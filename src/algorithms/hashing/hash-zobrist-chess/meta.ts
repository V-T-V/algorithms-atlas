// hash-zobrist-chess · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-zobrist-chess',
  categoryId: 'hashing',
  title: { zh: 'Zobrist (Chess)', en: 'Zobrist (Chess)' },
  summary: {
    zh: 'Zobrist 哈希：用 64 位随机数为棋盘每个 (格, 棋子) 预生成，XOR 得到局面哈希，支持增量更新。',
    en: 'Zobrist hash: pre-generated 64-bit randoms per (square, piece); XOR gives position hash with incremental updates.',
  },
  description: {
    zh: 'Zobrist 哈希（1970）：\n\n- 为棋盘 64 格 × 12 种棋子（6 白 6 黑）各生成一个随机 64 位数。\n- 局面哈希 = 所有 (格, 棋子) 的随机数 XOR。\n- 走子时只需 XOR 两次（移除起位、加入终位），O(1) 增量。\n- 国际象棋引擎的置换表核心。',
    en: 'Zobrist hash (1970):\n\n- Pre-generate a random 64-bit number per (square, piece) over 64 squares x 12 pieces (6 white 6 black).\n- Position hash = XOR of all (square, piece) randoms.\n- A move only needs two XORs (remove source, add target), O(1) incremental.\n- Core of transposition tables in chess engines.',
  },
  tags: ['hashing', 'zobrist', 'chess', 'transposition-table'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
