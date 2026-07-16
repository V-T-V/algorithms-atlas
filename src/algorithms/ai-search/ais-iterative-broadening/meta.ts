// 迭代加宽搜索（Iterative Broadening）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-iterative-broadening',
  categoryId: 'ai-search',
  title: { zh: '迭代加宽搜索', en: 'Iterative Broadening' },
  summary: {
    zh: '逐步放宽每节点展开的子节点上限。',
    en: 'Progressively widens the branching factor cap.',
  },
  description: {
    zh: '迭代加宽(Iterative Broadening, Lee & Mahajan)每轮只展开每节点前 B 个子节点，B 递增，用受限宽度换取早终止。',
    en: 'Iterative Broadening expands only the first B children per node per round, increasing B to trade breadth for early termination.',
  },
  tags: ['ai-search', 'iterative-broadening', 'tree-search'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
};
