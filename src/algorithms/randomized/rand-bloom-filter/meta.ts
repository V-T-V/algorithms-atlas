// 布隆过滤器 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-bloom-filter',
  categoryId: 'randomized',
  title: { zh: '布隆过滤器', en: 'Bloom Filter' },
  summary: { zh: '概率成员查询数据结构。', en: 'Probabilistic membership data structure.' },
  description: {
    zh: 'k 个哈希位图，可能有假阳性，无假阴性。',
    en: 'k hash bits; false positives possible, no false negatives.',
  },
  tags: ['randomized', 'data-structure', 'bloom'],
  complexity: { time: 'O(k)', space: 'O(m)' },
};
