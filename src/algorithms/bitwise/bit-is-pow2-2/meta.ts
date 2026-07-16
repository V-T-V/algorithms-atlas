// 2的幂判定v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-is-pow2-2',
  categoryId: 'bitwise',
  title: { zh: '2的幂判定v2', en: 'Power of Two v2' },
  summary: {
    zh: '用 (x & (x-1)) == 0 且 x>0 判定 2 的幂。',
    en: 'A power of two has exactly one set bit: x>0 and (x & (x-1)) == 0.',
  },
  description: {
    zh: '2 的幂的二进制恰有一个 1。x-1 会把最低位的 1 变 0 并其后所有 0 变 1，故 x & (x-1) == 0 当且仅当 x 只有一个 1。需排除 x=0。',
    en: 'A power of two has one set bit; x & (x-1) clears it, so result is 0. Exclude x=0. O(1).',
  },
  tags: ['bitwise', 'power-of-two'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
