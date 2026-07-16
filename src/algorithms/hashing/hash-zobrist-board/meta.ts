// Zobrist 棋盘（Zobrist Board Hash）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-zobrist-board',
  categoryId: 'hashing',
  title: { zh: 'Zobrist 棋盘', en: 'Zobrist Board Hash' },
  summary: {
    zh: '棋盘每格每状态预生成随机数，整体哈希为异或和，支持增量更新。',
    en: 'Precompute random per cell-state; board hash is XOR sum, incrementally updatable.',
  },
  description: {
    zh: 'Zobrist：对 (位置, 棋子) 预生成 64 位随机数。棋盘哈希 = 所有占用格的随机数异或。移动只需异或两格。',
    en: 'Zobrist: precompute 64-bit random for (position, piece). Board hash = XOR of occupied cells. A move XORs two cells.',
  },
  tags: ['hashing', 'game', 'zobrist'],
  complexity: { time: 'O(1) per move', space: 'O(cells·pieces)' },
};
