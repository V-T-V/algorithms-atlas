// 二分插入排序变种 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-binary-insertion-2',
  categoryId: 'sorting',
  title: { zh: '二分插入排序变种（带重复计数）', en: 'Binary Insertion Sort (Stable Variant)' },
  summary: {
    zh: '在有序前缀中用二分查找定位插入点，并保证相等元素的相对顺序（稳定）。',
    en: 'Locate the insertion point by binary search over the sorted prefix, preserving the order of equal keys (stable).',
  },
  description: {
    zh: '二分插入排序变种在插入排序的基础上，用二分查找（取右界，bisectRight）在已排序前缀中找到第一个「严格大于 key」的位置，再把该位置之后整体右移一格后插入。使用右界查找保证稳定性：相等元素按原顺序排列。比较次数降至 O(n log n)，但元素移动仍是 O(n²)，故整体最坏时间不变。',
    en: 'This variant of binary insertion sort uses binary search (rightmost, bisectRight) to find the first position strictly greater than the key in the sorted prefix, then shifts the tail right by one and inserts. Using the right bound guarantees stability: equal keys keep their original order. Comparisons drop to O(n log n), but moves remain O(n²), so worst-case time is unchanged.',
  },
  tags: ['sorting', 'insertion', 'binary-search', 'stable'],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
