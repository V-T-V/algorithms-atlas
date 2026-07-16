// 区间异或v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-xor-range-2',
  categoryId: 'bitwise',
  title: { zh: '区间异或v2', en: 'XOR of Range v2' },
  summary: {
    zh: '由前缀异或模式 O(1) 求 [m,n] 异或。',
    en: 'Compute XOR over [m, n] using the n-mod-4 prefix pattern.',
  },
  description: {
    zh: 'xor(0..n) 依 n%4 取值：n, 1, n+1, 0。区间 [m,n] = xor(0..n) ^ xor(0..m-1)。',
    en: 'xor(0..n) follows an n%4 pattern; [m,n] = f(n) ^ f(m-1). O(1).',
  },
  tags: ['bitwise', 'range', 'xor'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
