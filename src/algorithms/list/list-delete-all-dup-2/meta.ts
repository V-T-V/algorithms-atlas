// 删除所有重复值 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-delete-all-dup-2',
  categoryId: 'list',
  title: { zh: '删除所有重复值', en: 'Remove All Duplicates' },
  summary: {
    zh: '有序链表中如果一个值出现多次，全部删除。',
    en: 'In a sorted list, delete every value that appears more than once.',
  },
  description: {
    zh: '用 dummy 头，遇到 cur/cur.next/cur.next.next 相同时跳过整段。',
    en: 'Dummy head; skip runs of duplicates entirely. O(n), O(1).',
  },
  tags: ['list', 'duplicates', 'sorted'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
