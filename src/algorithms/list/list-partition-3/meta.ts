// 按值分区v3 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-partition-3',
  categoryId: 'list',
  title: { zh: '按值分区v3', en: 'Partition List v3' },
  summary: {
    zh: '把小于 x 的节点移到前面，保持相对顺序。',
    en: 'Move nodes smaller than x to the front, preserving order.',
  },
  description: {
    zh: '维护两个子链表（less / ge），最后拼接。',
    en: 'Build two sublists (<x and >=x) then concatenate. O(n), O(1).',
  },
  tags: ['list', 'partition'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
