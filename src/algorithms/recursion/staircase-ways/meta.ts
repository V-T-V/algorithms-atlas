// Staircase Ways · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'staircase-ways',
  categoryId: 'recursion',
  title: { zh: '爬楼梯', en: 'Staircase Ways' },
  summary: {
    zh: '递归+记忆化经典：到第 n 阶方法数 = ways(n-1)+ways(n-2)，即平移斐波那契。',
    en: 'A recursion + memoization classic: ways to reach step n equals ways(n-1)+ways(n-2), a shifted Fibonacci.',
  },
  description: {
    zh: '爬楼梯是动态规划与递归最经典的入门问题之一：有 n 级台阶，每次可以爬 1 级或 2 级，问有多少种不同的爬法？\n\n递归关系：到达第 n 阶的最后一步要么从第 n-1 阶跨 1 级，要么从第 n-2 阶跨 2 级，因此：\n  ways(n) = ways(n-1) + ways(n-2)\n基线：ways(0) = 1（原地不动算一种），ways(1) = 1。\n\n这正是「平移一位的斐波那契数列」：ways(2)=2, ways(3)=3, ways(4)=5, ways(5)=8……\n\n朴素递归的时间复杂度是 O(2^n)（指数级，大量重叠子问题重复计算）；引入「记忆化」（缓存每个 ways(k)）后降为 O(n)。本实现提供两个版本对比，正是「重叠子问题 + 记忆化 → 动态规划」思想的最小范例。',
    en: 'Climbing stairs is one of the most classic introductory problems for dynamic programming and recursion: given n steps, each time you can climb 1 or 2 steps, how many distinct ways are there to reach the top?\n\nRecurrence: the last move to step n is either a 1-step from n-1 or a 2-step from n-2, so:\n  ways(n) = ways(n-1) + ways(n-2)\nBase cases: ways(0) = 1 (one way to stay put), ways(1) = 1.\n\nThis is exactly the Fibonacci sequence shifted by one: ways(2)=2, ways(3)=3, ways(4)=5, ways(5)=8...\n\nNaive recursion is O(2^n) (exponential, with massive overlapping subproblems); adding "memoization" (caching each ways(k)) reduces it to O(n). This implementation provides both versions for comparison — a minimal illustration of "overlapping subproblems + memoization → dynamic programming".',
  },
  tags: ['recursion', 'dynamic-programming', 'memoization', 'fibonacci'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
