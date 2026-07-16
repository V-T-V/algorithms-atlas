// 记忆化斐波那契 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-fib-memo',
  categoryId: 'recursion',
  title: { zh: '记忆化斐波那契', en: 'Memoized Fibonacci' },
  summary: {
    zh: '带记忆化的递归 fib：用缓存消除重叠子问题，降到 O(n)。',
    en: 'Memoized recursive fibonacci: cache eliminates overlapping subproblems, O(n).',
  },
  description: {
    zh: '记忆化递归（自顶向下 DP）：memo[n] 缓存已算结果，每个 fib(k) 只算一次。',
    en: 'Memoized recursion (top-down DP): memo[n] caches results; each fib(k) is computed only once.',
  },
  tags: ['recursion', 'fibonacci', 'dp', 'memoization'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
