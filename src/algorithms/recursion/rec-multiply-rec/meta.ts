// 递归乘法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-multiply-rec',
  categoryId: 'recursion',
  title: { zh: '递归乘法', en: 'Recursive Multiply' },
  summary: {
    zh: '递归实现 a×b = a + a×(b−1)，用加法替代乘法。',
    en: 'Recursive multiply: a×b = a + a×(b−1) using addition instead of multiplication.',
  },
  description: {
    zh: '俄罗斯式/递归加法：以 b 为计数，每次递归把 b 减 1、把 a 累加。基线 b=0 返回 0。',
    en: 'Recursive addition: with b as counter, each recursion decrements b and accumulates a. Base case b=0 returns 0.',
  },
  tags: ['recursion', 'arithmetic'],
  complexity: { time: 'O(b)', space: 'O(b)' },
};
