// 有序去重v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-delete-dup-2',
  categoryId: 'list',
  title: { zh: '有序去重v2', en: 'Remove Duplicates from Sorted v2' },
  summary: {
    zh: '删除有序链表中的重复节点，保留唯一副本。',
    en: 'Drop duplicates from a sorted list, keeping one copy each.',
  },
  description: {
    zh: '遍历时若 cur.value == cur.next.value 则跳过 next。',
    en: 'Skip next when cur.val==next.val. O(n), O(1).',
  },
  tags: ['list', 'duplicates', 'sorted'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
