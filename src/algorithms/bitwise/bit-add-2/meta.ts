// 位运算加法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-add-2',
  categoryId: 'bitwise',
  title: { zh: '位运算加法', en: 'Addition via Bit Ops' },
  summary: {
    zh: '用 XOR（本位和）与 AND（进位）迭代模拟加法。',
    en: 'Iterative half/full adder: XOR for sum, AND<<1 for carry.',
  },
  description: {
    zh: '无进位和 = a^b，进位 = (a&b)<<1；反复令 (a,b)=(sum, carry) 直到 carry=0。',
    en: 'sum=a^b, carry=(a&b)<<1; repeat until carry=0. O(log n).',
  },
  tags: ['bitwise', 'addition', 'half-adder'],
  complexity: { time: 'O(log bits)', space: 'O(1)' },
};
