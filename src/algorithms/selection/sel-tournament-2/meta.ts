// 锦标赛选择 v2（Tournament Select v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-tournament-2',
  categoryId: 'selection',
  title: { zh: '锦标赛选择 v2', en: 'Tournament Select v2' },
  summary: {
    zh: '锦标赛：单淘汰赛制选出第 k 小。',
    en: 'Tournament: single-elimination to find the k-th smallest.',
  },
  description: {
    zh: '锦标赛选择用淘汰赛树选出最小（冠军）；要选第 k 小则把冠军替换为 +∞ 后重赛，重复 k 次。',
    en: 'Tournament select uses an elimination tree to find the minimum (champion); to find the k-th smallest, replace the champion with +∞ and replay, k times.',
  },
  tags: ['selection', 'tournament', 'tree'],
  complexity: { time: 'O(n + k log n)', space: 'O(n)' },
};
