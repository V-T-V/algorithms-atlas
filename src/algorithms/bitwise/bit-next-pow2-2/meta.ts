// 下一个2的幂 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-next-pow2-2',
  categoryId: 'bitwise',
  title: { zh: '下一个2的幂', en: 'Next Power of Two' },
  summary: {
    zh: '把任意正整数向上取整到最近的 2 的幂。',
    en: 'Round up a positive integer to the next power of two.',
  },
  description: {
    zh: '不断把最高位之后的位全部填 1（折半传播），再加 1 即得。x=1 返回 1。',
    en: 'Propagate the highest set bit down to fill all lower bits, then add 1. O(1).',
  },
  tags: ['bitwise', 'power-of-two', 'round'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
