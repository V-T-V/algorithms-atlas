// 递归泰波那契 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-tribonacci-rec',
  categoryId: 'recursion',
  title: { zh: '递归泰波那契', en: 'Recursive Tribonacci' },
  summary: {
    zh: 'T(n) = T(n−1)+T(n−2)+T(n−3)，基线 T(0)=0,T(1)=0,T(2)=1。',
    en: 'T(n) = T(n−1)+T(n−2)+T(n−3) with T(0)=0,T(1)=0,T(2)=1.',
  },
  description: {
    zh: '泰波那契：三阶线性递推，时间复杂度 O(c^n)。',
    en: 'Tribonacci: third-order linear recurrence, O(c^n) time.',
  },
  tags: ['recursion', 'linear-recurrence'],
  complexity: { time: 'O(c^n)', space: 'O(n)' },
};
