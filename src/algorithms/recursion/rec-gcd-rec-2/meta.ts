// 递归最大公约数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-gcd-rec-2',
  categoryId: 'recursion',
  title: { zh: '递归最大公约数', en: 'Recursive GCD (Euclid)' },
  summary: {
    zh: '欧几里得算法：gcd(a,b) = gcd(b, a mod b)，基线 gcd(a,0)=a。',
    en: 'Euclidean algorithm: gcd(a,b) = gcd(b, a mod b), base gcd(a,0)=a.',
  },
  description: {
    zh: '递归欧几里得：每一轮用模运算把问题规模缩小到一半以下，对数时间复杂度。',
    en: 'Recursive Euclid: modular reduction halves the problem each round; logarithmic time.',
  },
  tags: ['recursion', 'number-theory', 'gcd'],
  complexity: { time: 'O(log(min(a,b)))', space: 'O(log n)' },
};
