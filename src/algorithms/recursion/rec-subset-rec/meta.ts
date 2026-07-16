// 递归子集计数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-subset-rec',
  categoryId: 'recursion',
  title: { zh: '递归子集计数', en: 'Recursive Subset Count' },
  summary: {
    zh: '子集数：S(n,k) = S(n−1,k−1) + S(n−1,k)。从 n 元素中选大小为 k 的子集。',
    en: 'Subset count: S(n,k) = S(n−1,k−1) + S(n−1,k). Subsets of size k from n elements.',
  },
  description: {
    zh: '子集计数：与组合数同递推，但侧重「选/不选」决策树视角。',
    en: 'Subset counting: same recurrence as binomial but framed as a choose/skip decision tree.',
  },
  tags: ['recursion', 'combinatorics', 'subset'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
