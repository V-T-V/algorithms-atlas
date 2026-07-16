// 交换第k与倒数k · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-swap-k-2',
  categoryId: 'list',
  title: { zh: '交换第k与倒数k', en: 'Swap Kth from Both Ends' },
  summary: {
    zh: '交换链表正数第 k 个与倒数第 k 个节点的值。',
    en: 'Swap values of the kth node from head and kth from end.',
  },
  description: {
    zh: '一遍扫描得长度 n，定位第 k 与第 (n-k+1) 个节点，交换其 value。',
    en: 'Find length, locate both, swap values. O(n), O(1).',
  },
  tags: ['list', 'swap', 'indexing'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
