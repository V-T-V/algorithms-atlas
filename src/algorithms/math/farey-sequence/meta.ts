import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'farey-sequence',
  categoryId: 'math',
  title: { zh: '法里数列', en: 'Farey Sequence' },
  summary: {
    zh: '[0,1] 间分母 ≤ n 的既约分数升序，用相邻项递推构造。',
    en: 'Reduced fractions in [0,1] with denominator <= n, in order, via neighbor recurrence.',
  },
  description: {
    zh: 'n 阶法里数列 F_n 是 [0,1] 之间分母不超过 n 的所有既约（最简）分数按升序排列而成的序列，例如 F_5 = 0/1, 1/5, 1/4, 1/3, 2/5, 1/2, 3/5, 2/3, 3/4, 4/5, 1/1。相邻两项 a/b、c/d 满足 bc−ad=1（法里邻项性质）。由此可递推：从首两项出发，下一项 e/f = ⌊(n+b)/d⌋·(c,d) − (a,b)。项数 |F_n| = 1 + Σ_{k=1}^{n} φ(k)。时间 O(|F_n|) = O(n²)。',
    en: 'The Farey sequence F_n lists all reduced fractions in [0,1] with denominator at most n in ascending order, e.g. F_5 = 0/1, 1/5, ..., 1/1. Consecutive terms a/b, c/d satisfy bc-ad=1 (Farey neighbors), enabling the recurrence: from the first two terms, the next is ⌊(n+b)/d⌋·(c,d) − (a,b). The length |F_n| = 1 + Σ_{k=1}^{n} φ(k). Time O(|F_n|) = O(n²).',
  },
  tags: ['math', 'number-theory', 'fraction', 'farey', 'sequence'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
