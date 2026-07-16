// 几何分桶哈希（Geometric Bucket Hash）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-geometric-bucket',
  categoryId: 'hashing',
  title: { zh: '几何分桶哈希', en: 'Geometric Bucket Hash' },
  summary: {
    zh: '把浮点数量化到指数桶，适合对数尺度数据的快速分桶。',
    en: 'Quantize floats into exponential buckets; fast bucketing for log-scale data.',
  },
  description: {
    zh: '几何分桶：value 映射到 floor(log2(|v|)) 桶号，相同数量级落同桶。用于去重与统计分布。',
    en: 'Geometric bucket: map value to floor(log2(|v|)); same magnitude lands in same bucket. Used for dedup and distribution stats.',
  },
  tags: ['hashing', 'bucketing', 'floating-point'],
  complexity: { time: 'O(1)', space: 'O(b)' },
};
