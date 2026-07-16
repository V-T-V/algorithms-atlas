// 第 N 个丑数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-nth-ugly-2',
  categoryId: 'misc',
  title: { zh: '第 N 个丑数', en: 'Nth Ugly Number' },
  summary: {
    zh: '三指针法生成丑数序列，求第 n 个。',
    en: 'Three-pointer method to generate ugly numbers in order; return the n-th.',
  },
  description: {
    zh: 'LeetCode 264 丑数 II：用三指针分别对应 ×2/×3/×5，每次取最小，O(n)。',
    en: 'LeetCode 264 Ugly Number II: three pointers for ×2/×3/×5; pick the min each step, O(n).',
  },
  tags: ['misc', 'math', 'dp', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
