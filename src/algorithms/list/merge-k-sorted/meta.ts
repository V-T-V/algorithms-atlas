// Merge K Sorted Lists · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'merge-k-sorted',
  categoryId: 'list',
  title: { zh: '合并 K 个有序链表', en: 'Merge K Sorted Lists' },
  summary: {
    zh: '合并 K 个有序链表属于list类别。',
    en: 'Merge K Sorted Lists is a list algorithm.',
  },
  description: {
    zh: '合并 K 个有序链表（Merge K Sorted Lists）属于list类别的算法。',
    en: 'Merge K Sorted Lists is an algorithm in the list category.',
  },
  tags: ["list","sorting"],
  complexity: { time: 'O(N log K)', space: 'O(K)' },
};
