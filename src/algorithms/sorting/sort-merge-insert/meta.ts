// 归并排序（小段插入） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-merge-insert',
  categoryId: 'sorting',
  title: { zh: '归并排序（小段插入）', en: 'Merge Sort (Insertion for Small Runs)' },
  summary: {
    zh: '递归到小段（<=16）时改用插入排序，减少递归与归并开销。',
    en: 'Switch to insertion sort for runs <= 16 to cut recursion/merge overhead.',
  },
  description: {
    zh: '归并排序的递归基通常到长度 1。本优化版设阈值 M=16：当子段长度 <= M 时改用插入排序（小规模下常数更小、缓存友好），再正常归并。这是 TimSort/ introsort 等混合排序的常见技巧。整体仍 O(n log n) 但常数更小，尤其对中等规模数据。稳定。',
    en: "Merge sort's recursion base is usually length 1. This optimized variant sets a threshold M=16: when a sub-run has length <= M it switches to insertion sort (smaller constant, cache-friendly on small sizes), then merges normally. This hybrid trick is used in TimSort/introsort. Overall still O(n log n) with a smaller constant, especially for medium-sized data. Stable.",
  },
  tags: ['sorting', 'comparison', 'stable', 'hybrid', 'merge'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
