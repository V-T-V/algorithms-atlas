// 闪排序（稠密分桶） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-flash-2',
  categoryId: 'sorting',
  title: { zh: '闪排序（稠密分桶）', en: 'Flash Sort (Dense Bucket)' },
  summary: {
    zh: '按值线性映射到 m 个桶，桶内插入排序后收集，近似线性。',
    en: 'Linearly map values to m buckets, insertion-sort each, then collect; near-linear on uniform input.',
  },
  description: {
    zh: '闪排序（Flash Sort）类似桶排序，但用线性映射 a[i] -> bucketIdx 把元素分到 m=floor(0.42*n) 个桶，桶边界按 min/max 线性划分。先统计每桶元素数并前缀和定位桶边界，再把元素「就地」交换到正确桶（类似计数排序的置换），最后每桶内插入排序。对均匀分布数据近似 O(n)。本实现用显式桶数组简化。空间 O(n)。',
    en: "Flash sort resembles bucket sort but maps values linearly a[i] -> bucketIdx into m=floor(0.42*n) buckets with boundaries split linearly between min and max. It tallies per-bucket counts, prefix-sums to locate boundaries, permutes elements in place (like counting sort's permutation), then insertion-sorts each bucket. Near O(n) on uniform input. This implementation uses explicit bucket arrays for simplicity. Space O(n).",
  },
  tags: ['sorting', 'distribution', 'in-place-ish', 'integer-ish'],
  complexity: { time: 'O(n+k)', space: 'O(n)' },
};
