// 图书馆排序（带空位） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-library-gapped',
  categoryId: 'sorting',
  title: { zh: '图书馆排序（带空位）', en: 'Library Sort (Gapped)' },
  summary: {
    zh: '插入排序的带空位版：预留空槽让插入只需少量后移。',
    en: 'Insertion sort with gaps: pre-reserve empty slots so insertions shift few elements.',
  },
  description: {
    zh: '图书馆排序（Library Sort / Gapped Insertion Sort）是插入排序的改进：在数组中预留空位（gap），新元素插入时先二分找到位置，若该处为空直接放入，否则局部整理后放入。均摊下每次插入 O(1)，整体 O(n log n)。本实现简化为：用稀疏数组（容量 2n），元素按序紧凑存放，插入时二分定位 + 局部平移。空间 O(n)。',
    en: 'Library sort (gapped insertion sort) improves on insertion sort by leaving gaps in the array; a new element is binary-searched to its position, placed directly if empty, else locally rearranged. Amortized each insertion is O(1), overall O(n log n). This implementation uses a sparse array (capacity 2n) with elements packed in order, binary-locating + local shift on insert. Space O(n).',
  },
  tags: ['sorting', 'comparison', 'insertion', 'gapped'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
