// 重排链表v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-reorder-2',
  categoryId: 'list',
  title: { zh: '重排链表v2', en: 'Reorder List v2' },
  summary: {
    zh: '把 L0→L1→...→Ln 重排为 L0→Ln→L1→Ln-1→...。',
    en: 'Reorder L0,L1,...,Ln as L0,Ln,L1,Ln-1,...',
  },
  description: {
    zh: '找中点 → 反转后半 → 交替合并。',
    en: 'Find mid, reverse second half, interleave. O(n), O(1).',
  },
  tags: ['list', 'reorder'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
