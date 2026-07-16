// 递归卢卡斯数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-lucas-rec',
  categoryId: 'recursion',
  title: { zh: '递归卢卡斯数', en: 'Recursive Lucas' },
  summary: {
    zh: 'L(n) = L(n−1)+L(n−2)，基线 L(0)=2, L(1)=1。',
    en: 'L(n) = L(n−1)+L(n−2) with L(0)=2, L(1)=1.',
  },
  description: {
    zh: '卢卡斯数列：与斐波那契同递推但基线不同。',
    en: 'Lucas numbers: same recurrence as Fibonacci but different bases.',
  },
  tags: ['recursion', 'linear-recurrence'],
  complexity: { time: 'O(φ^n)', space: 'O(n)' },
};
