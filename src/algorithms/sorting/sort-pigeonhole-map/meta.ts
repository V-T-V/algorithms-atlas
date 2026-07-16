// 鸽巢排序（映射表） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-pigeonhole-map',
  categoryId: 'sorting',
  title: { zh: '鸽巢排序（映射表）', en: 'Pigeonhole Sort (Mapped)' },
  summary: {
    zh: '把值域内每个可能值映射到一个鸽巢，按值域顺序收集。',
    en: 'Map each possible value in the range to a pigeonhole; collect in value order.',
  },
  description: {
    zh: '鸽巢排序（Pigeonhole Sort）适合键为密集小区间整数的情况：值域范围 k 与元素数 n 接近时高效。本实现先求 min/max，建 (max-min+1) 个鸽巢（用 Map），每个元素按 (v-min) 放入对应巢，最后按巢序（含重复）收集。时间 O(n+k)，空间 O(n+k)。当 k 远大于 n 时不如计数排序高效，但概念清晰。',
    en: 'Pigeonhole sort suits dense small-range integer keys: efficient when the value range k is close to the element count n. This implementation finds min/max, creates (max-min+1) pigeonholes (via a Map), places each element by (v-min), then collects in hole order (including duplicates). Time O(n+k), space O(n+k). When k >> n it is less efficient than counting sort but conceptually clear.',
  },
  tags: ['sorting', 'non-comparison', 'integer', 'distribution'],
  complexity: { time: 'O(n+k)', space: 'O(n+k)' },
};
