import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-skiplist-2',
  categoryId: 'ds',
  title: { zh: '跳表（概率多层）', en: 'Skip List (Probabilistic)' },
  summary: {
    zh: '用多级索引链表实现 O(log n) 查找/插入/删除。',
    en: 'Multi-level indexed linked list giving O(log n) search/insert/delete.',
  },
  description: {
    zh: '每层是下层的「稀疏」副本。插入时以 50% 概率提升到上层。期望层数 O(log n)。',
    en: 'Each level is a sparse copy of the one below; insert promotes with 50% probability. Expected levels O(log n).',
  },
  tags: ['ds', 'skip-list', 'linked-list'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
