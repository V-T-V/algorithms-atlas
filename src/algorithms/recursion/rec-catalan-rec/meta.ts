// 递归卡塔兰数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-catalan-rec',
  categoryId: 'recursion',
  title: { zh: '递归卡塔兰数', en: 'Recursive Catalan' },
  summary: {
    zh: 'C(n) = Σ_{i=0}^{n−1} C(i)·C(n−1−i)，基线 C(0)=1。',
    en: 'C(n) = Σ_{i=0}^{n−1} C(i)·C(n−1−i) with C(0)=1.',
  },
  description: {
    zh: '卡塔兰数：组合数学经典序列，统计括号配对、二叉树形态等。',
    en: 'Catalan numbers: classic combinatorial sequence counting bracket pairs, binary tree shapes, etc.',
  },
  tags: ['recursion', 'combinatorics', 'catalan'],
  complexity: { time: 'O(4^n / √n)', space: 'O(n)' },
};
