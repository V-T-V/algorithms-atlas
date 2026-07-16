// 计数选择 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'counting-select',
  categoryId: 'selection',
  title: { zh: '计数选择', en: 'Counting Select' },
  summary: {
    zh: '值域小的整数上用频数前缀和直接定位第 k 小，O(n+V)。',
    en: 'Locate k-th smallest via frequency prefix sums on a small value range, O(n+V).',
  },
  description: {
    zh: '当元素是非负整数且最大值 V 不大时（如颜色、年龄、分数），用计数排序的思想即可做选择：\n\n- 统计每个值的出现次数 cnt[v]\n- 从小到大累加 cnt，累加值 >= k+1 时的那个 v 即第 k 小（0-based）\n\n时间 O(n + V)，空间 O(V)，常数极小且无比较。',
    en: 'When elements are non-negative integers with a small max value V (e.g. colors, ages, scores), use counting-sort style selection:\n\n- Tally counts cnt[v]\n- Accumulate from 0 up; the value where the running sum first reaches >= k+1 is the k-th smallest (0-based)\n\nTime O(n + V), space O(V), tiny constants, comparison-free.',
  },
  tags: ['counting', 'non-comparison', 'order-statistics'],
  complexity: { time: 'O(n + V)', space: 'O(V)' },
};
