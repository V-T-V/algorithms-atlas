// Rice 块编码（Rice Block Coding）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-rice-block',
  categoryId: 'compression',
  title: { zh: 'Rice 块编码', en: 'Rice Block Coding' },
  summary: { zh: '块内自适应选最优 k 的 Rice。', en: 'Per-block adaptive Rice with best k.' },
  description: {
    zh: 'Rice 块编码把数据分块，每块遍历 k 求最短码长并写入块头，平衡压缩率与解码速度(FLAC 残差使用)。',
    en: 'Rice block coding partitions data, finds the best k per block by minimizing total bits, writing k in the header (FLAC residuals).',
  },
  tags: ['compression', 'rice', 'adaptive'],
  complexity: { time: 'O(n log k)', space: 'O(n)' },
};
