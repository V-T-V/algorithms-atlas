// 前导连续1 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-leading-ones-2',
  categoryId: 'bitwise',
  title: { zh: '前导连续1', en: 'Count Leading Ones' },
  summary: { zh: '统计最高位起连续 1 的个数。', en: 'Count contiguous 1 bits from the MSB.' },
  description: { zh: 'clo = clz(~x)。', en: 'clo(x) = clz(~x). O(1).' },
  tags: ['bitwise', 'leading-ones', 'clz'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
