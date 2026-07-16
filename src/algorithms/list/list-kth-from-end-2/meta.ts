// 倒数第k个v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-kth-from-end-2',
  categoryId: 'list',
  title: { zh: '倒数第k个v2', en: 'Kth From End v2' },
  summary: {
    zh: '一次遍历返回倒数第 k 个节点值。',
    en: 'Return the kth node from the end in one pass.',
  },
  description: {
    zh: 'fast 先走 k 步，slow 同步走，fast 到末尾时 slow 即答案。',
    en: 'fast advances k first, then move together. O(n), O(1).',
  },
  tags: ['list', 'two-pointers'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
