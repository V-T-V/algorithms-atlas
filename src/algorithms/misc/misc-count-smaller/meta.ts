// 计数较小数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-count-smaller',
  categoryId: 'misc',
  title: { zh: '计数较小数', en: 'Count of Smaller Numbers' },
  summary: {
    zh: '对每个元素统计右边比它小的元素个数，归并排序求逆序对（LeetCode 315）。',
    en: 'For each element count how many smaller elements lie to its right, via merge sort (LeetCode 315).',
  },
  description: {
    zh: 'LeetCode 315 计算右侧小于当前元素的个数：\n\n- 对每个 nums[i]，统计 j>i 且 nums[j]<nums[i] 的个数。\n- 用带索引的归并排序：归并时每当右半元素先入队，说明左半剩余元素都大于它，给左半这些元素的计数 +1。\n- O(n log n)。',
    en: 'LeetCode 315 Count of Smaller Numbers After Self:\n\n- For each nums[i], count j>i with nums[j]<nums[i].\n- Use index-aware merge sort: when a right-half element is placed first, all remaining left-half elements are greater than it, so increment their counts.\n- O(n log n).',
  },
  tags: ['misc', 'merge-sort', 'divide-conquer', 'leetcode'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
