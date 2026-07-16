// 二进制转格雷码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-gray-code-2',
  categoryId: 'bitwise',
  title: { zh: '二进制转格雷码', en: 'Binary to Gray' },
  summary: { zh: 'gray = x ^ (x >> 1)。', en: 'Convert binary to Gray code: gray = x ^ (x >> 1).' },
  description: {
    zh: '格雷码相邻整数只有一位不同：g = b ^ (b >> 1)。',
    en: 'gray = x ^ (x >> 1); adjacent codes differ by one bit. O(1).',
  },
  tags: ['bitwise', 'gray-code'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
