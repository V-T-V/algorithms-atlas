// 异或交换v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-swap-2',
  categoryId: 'bitwise',
  title: { zh: '异或交换v2', en: 'XOR Swap v2' },
  summary: {
    zh: '不借助临时变量用三次异或交换两个变量。',
    en: 'Swap two variables with three XORs, no temp.',
  },
  description: {
    zh: 'a ^= b; b ^= a; a ^= b; 利用异或的自反性完成交换。注意：对同一内存位置（别名）会归零。',
    en: 'a^=b; b^=a; a^=b; uses self-inverse of XOR. Aliasing zeroes the value. O(1).',
  },
  tags: ['bitwise', 'swap', 'xor'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
