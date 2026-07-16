// Hall 定理验证（Hall Marriage Theorem）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-hall-matching',
  categoryId: 'greedy',
  title: { zh: 'Hall 定理验证', en: 'Hall Marriage Theorem' },
  summary: {
    zh: '二分图存在完美匹配当且仅当每个左侧子集的邻居数不少于自身大小。',
    en: 'A bipartite graph has a perfect matching iff every left subset has at least as many neighbors.',
  },
  description: {
    zh: 'Hall 定理：二分图 (L,R,E) 存在匹配覆盖 L 当且仅当 ∀S⊆L, |N(S)|≥|S|。枚举所有子集验证。',
    en: 'Hall theorem: bipartite (L,R,E) has a matching covering L iff ∀S⊆L, |N(S)|≥|S|. Enumerate subsets to verify.',
  },
  tags: ['greedy', 'bipartite', 'matching'],
  complexity: { time: 'O(2^|L| · |E|)', space: 'O(|L|)' },
};
