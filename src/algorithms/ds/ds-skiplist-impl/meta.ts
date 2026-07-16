import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-skiplist-impl',
  categoryId: 'ds',
  title: { zh: '跳表实现', en: 'Skip List Implementation' },
  summary: {
    zh: '期望 O(log n) 查找/插入的概率平衡跳表。',
    en: 'Probabilistically balanced skip list with expected O(log n) ops.',
  },
  description: {
    zh: '多层链表，每层是下层的稀疏索引；插入时随机决定层数。期望高度 O(log n)。',
    en: 'Multi-level linked lists where each level samples the one below; insert uses random level. Expected height O(log n).',
  },
  tags: ['ds', 'skiplist', 'probabilistic'],
  complexity: { time: 'O(log n) 期望', space: 'O(n)' },
};
