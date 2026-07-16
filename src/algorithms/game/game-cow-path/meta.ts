// 奶牛路径搜索（Cow Path Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-cow-path',
  categoryId: 'game',
  title: { zh: '奶牛路径搜索', en: 'Cow Path Search' },
  summary: {
    zh: '线上搜索问题：在一条双向线上找目标，使用倍增回溯达到竞争比 9。',
    en: 'Online search on a two-way line: doubling-strategy backtracking yields competitive ratio 9.',
  },
  description: {
    zh: '奶牛路径：目标位置未知（左或右任一距离）。策略：依次走 1,2,4,8... 到两侧，竞争比 9（最优确定性）。',
    en: 'Cow path: target at unknown distance left or right. Doubling strategy (1,2,4,8...) gives competitive ratio 9, optimal for deterministic online.',
  },
  tags: ['game', 'online-algorithm', 'competitive-ratio'],
  complexity: { time: 'O(log d)', space: 'O(1)' },
};
