// 查找第 k 个斐波那契数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-kth-fib-2',
  categoryId: 'searching',
  title: { zh: '查找第 k 个斐波那契数', en: 'K-th Fibonacci Number' },
  summary: {
    zh: '迭代计算第 k 个斐波那契数（F(0)=0, F(1)=1）。',
    en: 'Iteratively compute the k-th Fibonacci number (F(0)=0, F(1)=1).',
  },
  description: {
    zh: '查找第 k 个斐波那契数：给定 k，返回 F(k)。本实现用迭代法（避免递归指数爆炸与重复计算），从 F(0)=0, F(1)=1 起迭代 k 步。时间 O(k)，空间 O(1)。斐波那契数列在算法分析、动态规划、黄金分割中 ubiquitous。',
    en: 'K-th Fibonacci number: given k, return F(k). This implementation uses iteration (avoiding recursive blow-up and recomputation) starting from F(0)=0, F(1)=1 for k steps. Time O(k), space O(1). Fibonacci numbers are ubiquitous in algorithm analysis, dynamic programming, and the golden ratio.',
  },
  tags: ['searching', 'fibonacci', 'iterative', 'sequence'],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
