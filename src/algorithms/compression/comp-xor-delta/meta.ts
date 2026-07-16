// XOR 增量编码（XOR Delta）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-xor-delta',
  categoryId: 'compression',
  title: { zh: 'XOR 增量编码', en: 'XOR Delta' },
  summary: { zh: '用异或记录相邻值变化。', en: 'XORs adjacent values to record changes.' },
  description: {
    zh: 'XOR 增量编码输出 curr⊕prev，对浮点位模式或稀疏变化数据常出现大量前导 0，可压缩为短整数(Gorilla 时间序列使用)。',
    en: 'XOR delta emits curr⊕prev; on float bit-patterns or sparse changes it yields many leading zeros (Gorilla time-series).',
  },
  tags: ['compression', 'xor', 'delta', 'gorilla'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
