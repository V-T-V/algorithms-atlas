// 桶排序（sqrt(n) 桶） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-bucket-sqrt',
  categoryId: 'sorting',
  title: { zh: '桶排序（sqrt(n) 桶）', en: 'Bucket Sort (sqrt-n buckets)' },
  summary: {
    zh: '均匀分数组分到 sqrt(n) 个桶，各桶内插入排序后拼接。',
    en: 'Scatter values into sqrt(n) buckets, insertion-sort each, then concatenate.',
  },
  description: {
    zh: '桶排序（Bucket Sort）把值域均分成 k 个桶，每个元素按值分到对应桶，桶内用插入排序（小规模高效），最后按桶序拼接。本实现取 k = floor(sqrt(n)) 个桶，兼顾桶数与桶大小。当输入近似均匀分布时，每桶期望元素 O(1)，整体 O(n)。最坏（全落一个桶）退化为插入排序 O(n^2)。稳定（桶内插入排序稳定）。空间 O(n)。',
    en: 'Bucket sort partitions the value range into k buckets, scatters each element to its bucket, insertion-sorts each bucket (efficient for small sizes), then concatenates in bucket order. This implementation uses k = floor(sqrt(n)) buckets, balancing bucket count and size. For near-uniform input each bucket holds O(1) elements on average, giving O(n) overall; the worst case (all in one bucket) degenerates to insertion sort O(n^2). Stable. Space O(n).',
  },
  tags: ['sorting', 'bucket', 'comparison', 'stable', 'distribution'],
  complexity: { time: 'O(n+k)', space: 'O(n)' },
};
