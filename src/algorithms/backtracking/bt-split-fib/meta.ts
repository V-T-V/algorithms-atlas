// 拆分斐波那契串 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-split-fib',
  categoryId: 'backtracking',
  title: { zh: '拆分斐波那契串', en: 'Split into Fibonacci-like' },
  summary: {
    zh: '把字符串拆成斐波那契式序列。',
    en: 'Split string into a Fibonacci-like sequence.',
  },
  description: { zh: '回溯切数，满足前两数之和。', en: 'Backtrack, each = prev two sum. O(n^2).' },
  tags: ['backtracking', 'sequence'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
