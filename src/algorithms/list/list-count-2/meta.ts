// 计数v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-count-2',
  categoryId: 'list',
  title: { zh: '计数v2', en: 'Count List Length v2' },
  summary: { zh: '遍历统计链表节点数。', en: 'Traverse and count nodes.' },
  description: { zh: '顺序遍历累加。', en: 'Walk and increment. O(n), O(1).' },
  tags: ['list', 'length'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
