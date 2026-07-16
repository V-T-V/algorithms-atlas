// 并行 Alpha-Beta（Parallel Alpha-Beta）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-parallel-ab',
  categoryId: 'ai-search',
  title: { zh: '并行 Alpha-Beta', en: 'Parallel Alpha-Beta' },
  summary: {
    zh: '并行 alpha-beta：多线程并行搜索子树（PV-split 模拟）。',
    en: 'Parallel alpha-beta: search subtrees concurrently (PV-split simulation).',
  },
  description: {
    zh: '并行 alpha-beta 在多核上加速博弈搜索。本实现以确定性事件序列模拟若干 worker：先搜长子建立 α-β 窗口，再「并行」搜索剩余子节点（带剪枝）。YBWC 思想：年轻兄弟等待老兄弟完成后才并行。',
    en: 'Parallel alpha-beta speeds up game-tree search on multi-cores. This impl deterministically simulates workers: first search the eldest child to set an α-β window, then "parallelize" the rest with pruning. YBWC idea: younger brothers wait for the eldest.',
  },
  tags: ['ai-search', 'parallel', 'alpha-beta', 'game-tree'],
  complexity: { time: 'O(b^d / p)', space: 'O(b^d)' },
};
