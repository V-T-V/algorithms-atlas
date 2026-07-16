// HyperLogLog 估计（HyperLogLog Estimation）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-hyperloglog-estimate',
  categoryId: 'hashing',
  title: { zh: 'HyperLogLog 估计', en: 'HyperLogLog Estimation' },
  summary: {
    zh: '用桶记录前导零最大值，常数内存估计基数，误差约 1.04/√m。',
    en: 'Buckets track max leading-zero counts; constant memory cardinality estimate, error ~1.04/√m.',
  },
  description: {
    zh: 'HyperLogLog：哈希值前 b 位选桶，剩余位的前导零数+1 存入桶。基数 ≈ α·m²/Σ2^{-M[j]}。',
    en: 'HyperLogLog: top b bits pick bucket, store leading-zeros+1 of the rest. Cardinality ≈ alpha·m²/Σ2^{-M[j]}.',
  },
  tags: ['hashing', 'cardinality', 'sketch'],
  complexity: { time: 'O(1) per add', space: 'O(2^b)' },
};
