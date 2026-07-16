// Fringe Search（Fringe Search）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-fringe-search',
  categoryId: 'ai-search',
  title: { zh: 'Fringe Search', en: 'Fringe Search' },
  summary: {
    zh: 'IDA* 的改进版，维护待展开叶节点链表。',
    en: 'IDA* variant keeping a fringe list of leaves.',
  },
  description: {
    zh: 'Fringe Search 用一个链表保存当前边界节点，避免 IDA* 重复从头展开，对大阈值更高效。',
    en: 'Fringe Search keeps a linked list of frontier nodes, avoiding IDA* re-expansion from the root each round.',
  },
  tags: ['ai-search', 'fringe', 'heuristic'],
  complexity: { time: 'O(b^d)', space: 'O(b^d)' },
};
