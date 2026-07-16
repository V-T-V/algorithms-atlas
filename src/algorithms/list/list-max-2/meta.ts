// 求最大值v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-max-2',
  categoryId: 'list',
  title: { zh: '求最大值v2', en: 'Find Max in List v2' },
  summary: { zh: '遍历链表找最大节点值。', en: 'Traverse to find the maximum value.' },
  description: { zh: '维护当前最大值。', en: 'Track running max. O(n), O(1).' },
  tags: ['list', 'max'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
