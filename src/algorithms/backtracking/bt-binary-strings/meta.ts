// 二进制串枚举 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-binary-strings',
  categoryId: 'backtracking',
  title: { zh: '二进制串枚举', en: 'Binary Strings' },
  summary: {
    zh: '枚举长度 n 的所有二进制字符串。',
    en: 'Enumerate all binary strings of length n.',
  },
  description: { zh: '回溯每位选 0 或 1。', en: 'Backtrack each bit. O(2^n).' },
  tags: ['backtracking', 'binary'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
