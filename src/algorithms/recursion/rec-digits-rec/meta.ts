// 递归数字求和 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-digits-rec',
  categoryId: 'recursion',
  title: { zh: '递归数字求和', en: 'Recursive Digit Sum' },
  summary: {
    zh: '递归求整数各位数字之和：基线 n<10 返回 n。',
    en: 'Recursively sum digits of an integer; base n<10 returns n.',
  },
  description: {
    zh: '数字求和：每次取最低位 n%10 加上 n/10 的递归结果。',
    en: 'Digit sum: each step adds n%10 to the recursive result on n/10.',
  },
  tags: ['recursion', 'arithmetic', 'digits'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
