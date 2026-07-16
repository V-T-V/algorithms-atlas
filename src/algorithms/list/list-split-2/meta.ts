// 拆分链表v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-split-2',
  categoryId: 'list',
  title: { zh: '拆分链表v2', en: 'Split List by Value v2' },
  summary: {
    zh: '把链表按值 x 拆成 <x 与 >=x 两段（返回两个头）。',
    en: 'Split a list into two (<x and >=x) by a pivot value.',
  },
  description: {
    zh: '一次遍历把节点分别接到 less 或 ge 链。',
    en: 'Single pass, append to less/ge lists. O(n), O(1).',
  },
  tags: ['list', 'split'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
