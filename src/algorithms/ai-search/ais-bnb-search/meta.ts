// 分支定界搜索（Branch and Bound Search）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-bnb-search',
  categoryId: 'ai-search',
  title: { zh: '分支定界搜索', en: 'Branch and Bound Search' },
  summary: {
    zh: '用上/下界剪掉不可能更优的子树。',
    en: 'Prunes subtrees that cannot beat the bound.',
  },
  description: {
    zh: '分支定界(B&B)在搜索过程中维护当前最优解代价，对代价下界已超过最优的分支剪除。',
    en: 'Branch and Bound keeps the incumbent cost and prunes any branch whose lower bound exceeds it.',
  },
  tags: ['ai-search', 'branch-and-bound', 'optimization'],
  complexity: { time: 'O(2^n) worst', space: 'O(n)' },
};
