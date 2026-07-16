// IDEA（IDEA）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-idea',
  categoryId: 'crypto',
  title: { zh: 'IDEA', en: 'IDEA' },
  summary: {
    zh: 'IDEA：8.5 轮，混合模 2^16 加/乘/异或。',
    en: 'IDEA: 8.5 rounds mixing mod-2^16 add/mul/xor.',
  },
  description: {
    zh: 'IDEA（Lai & Massey 1991）64 位分组，8 轮 + 输出变换，三种运算（模 2^16 加、模 2^16+1 乘、异或）混合提供安全。',
    en: 'IDEA (Lai & Massey 1991) is a 64-bit-block cipher: 8 rounds + output transform, mixing three operations (mod-2^16 add, mod-2^16+1 mul, xor) for security.',
  },
  tags: ['crypto', 'idea', 'block', 'group-ops'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
