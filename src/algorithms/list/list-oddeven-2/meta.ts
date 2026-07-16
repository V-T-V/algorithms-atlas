// 奇偶分离v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-oddeven-2',
  categoryId: 'list',
  title: { zh: '奇偶分离v2', en: 'Odd Even Linked List v2' },
  summary: {
    zh: '把奇数位节点放前、偶数位节点放后，保持相对顺序。',
    en: 'Group odd-indexed nodes before even-indexed nodes.',
  },
  description: {
    zh: 'odd/even 两条链表交替前进，最后 even 接到 odd 末尾。',
    en: 'Two pointers for odd/even, then concat. O(n), O(1).',
  },
  tags: ['list', 'odd-even', 'reorder'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
