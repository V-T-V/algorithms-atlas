// Simple9 编码（Simple9）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-simple9',
  categoryId: 'compression',
  title: { zh: 'Simple9 编码', en: 'Simple9' },
  summary: { zh: '一个 32 位字塞多种位宽。', en: 'One 32-bit word holds varied bit widths.' },
  description: {
    zh: 'Simple9(Anh & Moffat)每个 32 位字用高 4 位选 9 种位宽之一，低 28 位紧密排列等长小整数，倒排索引紧凑存储。',
    en: 'Simple9 uses 4 selector bits to pick one of 9 layouts packing equal small ints into 28 bits per word.',
  },
  tags: ['compression', 'simple9', 'inverted-index'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
