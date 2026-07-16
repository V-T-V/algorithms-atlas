// 交替合并v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-zip-2',
  categoryId: 'list',
  title: { zh: '交替合并v2', en: 'Zip Two Lists v2' },
  summary: {
    zh: '把两链表交替合并：a1,b1,a2,b2,...。',
    en: 'Interleave two lists: a1,b1,a2,b2,...',
  },
  description: {
    zh: '轮流取 a、b 的节点接到结果。',
    en: 'Take turns appending from a and b. O(n+m), O(1).',
  },
  tags: ['list', 'merge', 'interleave'],
  complexity: { time: 'O(n+m)', space: 'O(1)' },
};
