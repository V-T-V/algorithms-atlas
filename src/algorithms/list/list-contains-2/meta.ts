// 包含判断v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-contains-2',
  categoryId: 'list',
  title: { zh: '包含判断v2', en: 'List Contains v2' },
  summary: { zh: '线性查找链表是否含某值。', en: 'Linear search for a value in the list.' },
  description: { zh: '顺序遍历比较。', en: 'Walk and compare. O(n), O(1).' },
  tags: ['list', 'search', 'contains'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
