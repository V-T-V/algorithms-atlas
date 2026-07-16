// 查表popcount · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-popcount-3',
  categoryId: 'bitwise',
  title: { zh: '查表popcount', en: 'Popcount by Lookup' },
  summary: {
    zh: '用 256 项字节查表实现 32 位 popcount。',
    en: '32-bit popcount via a 256-entry byte lookup table.',
  },
  description: {
    zh: '预生成 PC[256] 记录每个字节中 1 的个数；把 32 位整数拆成 4 个字节分别查表求和。',
    en: 'Precompute popcount per byte (256 entries), then sum the four bytes of x. O(1).',
  },
  tags: ['bitwise', 'popcount', 'lookup-table'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
