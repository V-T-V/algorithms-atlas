// Partition List · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'partition-list',
  categoryId: 'list',
  title: { zh: '分隔链表', en: 'Partition List' },
  summary: {
    zh: '分隔链表属于list类别。',
    en: 'Partition List is a list algorithm.',
  },
  description: {
    zh: '分隔链表（Partition List）属于list类别的算法。',
    en: 'Partition List is an algorithm in the list category.',
  },
  tags: ["list","dynamic-programming","linked-list"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
