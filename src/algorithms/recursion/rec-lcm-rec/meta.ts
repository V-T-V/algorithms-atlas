// 递归最小公倍数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-lcm-rec',
  categoryId: 'recursion',
  title: { zh: '递归最小公倍数', en: 'Recursive LCM' },
  summary: {
    zh: 'lcm(a,b) = a·b / gcd(a,b)，递归求 gcd 后算 lcm。',
    en: 'lcm(a,b) = a·b / gcd(a,b); recursively compute gcd then derive lcm.',
  },
  description: {
    zh: '最小公倍数：依赖 gcd 的欧几里得递归，再做一次除法。',
    en: 'Least common multiple: builds on recursive Euclid gcd, then one division.',
  },
  tags: ['recursion', 'number-theory', 'lcm'],
  complexity: { time: 'O(log(min(a,b)))', space: 'O(log n)' },
};
