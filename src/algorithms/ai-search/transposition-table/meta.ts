// 置换表 / Zobrist 哈希 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'transposition-table',
  categoryId: 'ai-search',
  title: { zh: '置换表 / Zobrist 哈希', en: 'Transposition Table / Zobrist Hashing' },
  summary: {
    zh: '用 Zobrist 哈希记录已搜局面，避免在博弈树中重复计算同一状态。',
    en: 'Hash already-searched positions via Zobrist hashing to avoid recomputation across transpositions.',
  },
  description: {
    zh: '博弈搜索中常出现「置换」—— 不同走法顺序导致同一局面。置换表用 Zobrist 哈希把棋盘压成一个 64 位整数：预先生成「每个格子×每个棋子」的随机数，状态哈希 = 各格随机数的异或；走子时增量更新（异或两次还原）。表项存 {depth, score, flag}，flag 标记该值是精确(EXACT)、上界(UPPER_BOUND) 还是下界(LOWER_BOUND)，配合 alpha-beta 窗口裁剪。本实现提供独立、可测试的 TranspositionTable 类与 Zobrist 增量工具。',
    en: 'Game search often hits "transpositions" — different move orders leading to the same position. A transposition table uses Zobrist hashing to fold the board into a 64-bit integer: precompute random numbers for each (cell, piece) pair and XOR them together; moves update the hash incrementally. Entries store {depth, score, flag} where flag marks the value as EXACT, an upper bound (UPPER_BOUND), or a lower bound (LOWER_BOUND), working with alpha-beta windows. This implementation provides a standalone, testable TranspositionTable class and Zobrist incrementality helpers.',
  },
  tags: ['ai-search', 'hashing', 'memoization', 'zobrist'],
  complexity: { time: 'O(1) 查/存均摊', space: 'O(表容量)' },
  references: [
    {
      label: 'Zobrist hashing — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Zobrist_hashing',
    },
    {
      label: 'Transposition table — Chessprogramming Wiki',
      url: 'https://www.chessprogramming.org/Transposition_Table',
    },
  ],
};
