// 欧拉函数区间（Euler Totient Range）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-euler-totient-range',
  categoryId: 'misc',
  title: { zh: '欧拉函数区间', en: 'Euler Totient Range' },
  summary: {
    zh: '批量计算 1..n 的 φ(i)，用线性筛 O(n)。',
    en: 'Compute φ(1..n) in batch via linear sieve in O(n).',
  },
  description: {
    zh: '欧拉函数 φ(n)=与 n 互素的个数。线性筛：φ(p)=p-1，φ(ip)=φ(i)·p（p|i 时）或 φ(i)(p-1)。',
    en: 'Euler phi: count coprime to n. Linear sieve: phi(p)=p-1, phi(ip)=phi(i)*p (p|i) or phi(i)(p-1).',
  },
  tags: ['misc', 'number-theory'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
