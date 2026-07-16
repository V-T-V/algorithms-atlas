// 4的幂判定v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-is-pow4-2',
  categoryId: 'bitwise',
  title: { zh: '4的幂判定v2', en: 'Power of Four v2' },
  summary: {
    zh: '判断是否为 4 的幂：2的幂且唯一1位在偶数位。',
    en: 'A power of four: a power of two with its set bit at an even index.',
  },
  description: {
    zh: '先 isPow2(x)，再 (x & 0x55555555) !== 0（4的幂的 1 必在偶数位）。',
    en: 'Power of two AND has set bit in even position (mask 0x55555555). O(1).',
  },
  tags: ['bitwise', 'power-of-four'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
