// 找中点v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-mid-2',
  categoryId: 'list',
  title: { zh: '找中点v2', en: 'Find Middle v2' },
  summary: { zh: '快慢指针一次遍历找链表中点。', en: 'One-pass middle via fast/slow pointers.' },
  description: {
    zh: 'slow 走一步、fast 走两步；fast 到末尾时 slow 即中点（偶数取前半最后一个）。',
    en: 'fast=2, slow=1; slow ends at middle. O(n), O(1).',
  },
  tags: ['list', 'middle', 'two-pointers'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
