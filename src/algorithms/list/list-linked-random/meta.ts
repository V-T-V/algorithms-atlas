// Linked List Random Node · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-linked-random',
  categoryId: 'list',
  title: { zh: '链表随机节点（蓄水池）', en: 'Linked List Random Node (Reservoir)' },
  summary: {
    zh: '蓄水池抽样从未知长度链表中均匀随机取一个节点（LeetCode 382）。',
    en: 'Reservoir sampling picks a uniform random node from a list of unknown length (LeetCode 382).',
  },
  description: {
    zh: '一次遍历：第 i 个节点以 1/i 的概率替换当前选择，保证每个节点等概率被选中。',
    en: 'One pass: replace current pick with the i-th node at probability 1/i for uniform selection.',
  },
  tags: ['list', 'randomized', 'reservoir-sampling', 'probability'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
