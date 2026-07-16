// 拍平多级链表v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-flatten-2',
  categoryId: 'list',
  title: { zh: '拍平多级链表v2', en: 'Flatten Multilevel List v2' },
  summary: {
    zh: '把带 child 指针的多级链表拍平为单级。',
    en: 'Flatten a multilevel doubly list with child pointers into one level.',
  },
  description: {
    zh: '遇到 child：把 child 链插入当前与 next 之间，递归处理。',
    en: 'Insert child sublist between current and next. O(n), O(1).',
  },
  tags: ['list', 'flatten', 'multilevel'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
