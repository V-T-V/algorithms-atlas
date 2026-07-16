// 插入区间 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-insert-interval',
  categoryId: 'greedy',
  title: { zh: '插入区间', en: 'Insert Interval' },
  summary: {
    zh: '把一个新区间插入已排序的不重叠区间列表，合并重叠部分。',
    en: 'Insert a new interval into a sorted non-overlapping list and merge overlaps.',
  },
  description: {
    zh: '一次扫描：先加完左侧不重叠的，合并与新区间重叠的，再加右侧剩余。',
    en: 'Single pass: add left non-overlapping, merge those overlapping the new interval, then add the right remainder.',
  },
  tags: ['greedy', 'interval'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
