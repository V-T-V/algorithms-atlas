// 符号提取 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-sign-2',
  categoryId: 'bitwise',
  title: { zh: '符号提取', en: 'Sign Extraction' },
  summary: {
    zh: '无分支提取整数符号：负为 -1、零为 0、正为 1。',
    en: 'Branchless signum: -1 for negatives, 0 for zero, 1 for positives.',
  },
  description: {
    zh: '对 x：signNeg = x >> 31（负数全1即 -1，非负 0）；isNonZero = (-x | x) >> 31（非零时 -1）。正号 = -isNonZero & ~signNeg。',
    en: 'signNeg = x>>31; nz = (-x|x)>>31; result combines them. O(1).',
  },
  tags: ['bitwise', 'sign', 'branchless'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
