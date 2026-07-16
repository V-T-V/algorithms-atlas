// 反转区间v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-reverse-range-2',
  categoryId: 'list',
  title: { zh: '反转区间v2', en: 'Reverse Sublist v2' },
  summary: {
    zh: '反转链表第 m 到第 n 个节点（1-based）。',
    en: 'Reverse nodes from position m to n (1-based).',
  },
  description: {
    zh: '定位前驱，逐个头插到前驱之后。',
    en: 'Locate predecessor, head-insert. O(n), O(1).',
  },
  tags: ['list', 'reverse', 'range'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
