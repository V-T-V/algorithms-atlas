// 交替k组反转 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-reverse-alt-k-2',
  categoryId: 'list',
  title: { zh: '交替k组反转', en: 'Reverse Alternate k-Group' },
  summary: { zh: '每 k 个一组，但只反转偶数序的组。', en: 'Reverse every other group of k nodes.' },
  description: {
    zh: '遍历时组序+1，奇数组保持、偶数组反转。',
    en: 'Group counter; reverse even-indexed groups. O(n), O(1).',
  },
  tags: ['list', 'reverse', 'group'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
