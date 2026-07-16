// 合并k个链表v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-merge-k-2',
  categoryId: 'list',
  title: { zh: '合并k个链表v2', en: 'Merge k Sorted Lists v2' },
  summary: {
    zh: '顺序两两合并 k 个有序链表。',
    en: 'Merge k sorted lists by pairwise sequential merge.',
  },
  description: {
    zh: '累加式合并：result = merge(result, lists[i])。',
    en: 'Sequential pairwise merge. O(kN), O(1).',
  },
  tags: ['list', 'merge', 'k-way'],
  complexity: { time: 'O(kN)', space: 'O(1)' },
};
