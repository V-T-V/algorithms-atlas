// Swap Nodes in Pairs · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'swap-nodes',
  categoryId: 'list',
  title: { zh: '两两交换节点', en: 'Swap Nodes in Pairs' },
  summary: {
    zh: '两两交换节点属于list类别。',
    en: 'Swap Nodes in Pairs is a list algorithm.',
  },
  description: {
    zh: '两两交换节点（Swap Nodes in Pairs）属于list类别的算法。',
    en: 'Swap Nodes in Pairs is an algorithm in the list category.',
  },
  tags: ["list"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
