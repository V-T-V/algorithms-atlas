// Mini-Batch 迭代器 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-batch-iter',
  categoryId: 'ml',
  title: { zh: 'Mini-Batch 迭代器', en: 'Mini-Batch Iterator' },
  summary: { zh: '把数据切分为小批量供 SGD 训练。', en: 'Slice data into mini-batches for SGD.' },
  description: {
    zh: '每次返回大小为 batchSize 的子集。',
    en: 'Each iteration yields a subset of size batchSize; last may be smaller.',
  },
  tags: ['ml', 'optimization'],
  complexity: { time: 'O(n)', space: 'O(batch)' },
};
