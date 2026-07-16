// 递归斐波那契 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-fib-rec',
  categoryId: 'recursion',
  title: { zh: '递归斐波那契', en: 'Recursive Fibonacci' },
  summary: {
    zh: '朴素递归 fib(n) = fib(n−1) + fib(n−2)，基线 fib(0)=0, fib(1)=1。',
    en: 'Naive recursive fibonacci: fib(n) = fib(n−1) + fib(n−2).',
  },
  description: {
    zh: '朴素递归斐波那契：时间复杂度 O(φ^n)，重叠子问题指数爆炸，是动态规划的反面教材。',
    en: 'Naive recursive fibonacci: O(φ^n) time, exponential overlapping subproblems; the canonical DP counterexample.',
  },
  tags: ['recursion', 'fibonacci', 'dp'],
  complexity: { time: 'O(φ^n)', space: 'O(n)' },
};
