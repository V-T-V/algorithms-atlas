// 类欧几里得 floor_sum（BigInt 版）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'floor-sum-mod',
  categoryId: 'math',
  title: { zh: '类欧几里得 floor_sum（BigInt）', en: 'Euclidean-like floor_sum (BigInt)' },
  summary: {
    zh: 'BigInt 版 Σ⌊(a·i+b)/m⌋，O(log m) 递归。',
    en: 'BigInt version of Σ⌊(a·i+b)/m⌋ in O(log m) recursion.',
  },
  description: {
    zh: '类欧几里得算法计算 S = Σ_{i=0}^{n-1} ⌊(a·i+b)/m⌋。几何意义：统计直线 y=(a·x+b)/m 下方、x=0..n-1 内的整点数。通过坐标变换把 (n,m,a,b) 规约到更小规模：当 a≥m 时拆出 (a/m)·n(n-1)/2；当 b≥m 时拆出 (b/m)·n；剩余 a<m,b<m 时用对称变换转化为 y·m < a·x+b 的计数。O(log m) 递归。BigInt 实现，支持大参数。区别于已有的 number 版 floor-sum。',
    en: 'The Euclidean-like algorithm computes S = Σ_{i=0}^{n-1} ⌊(a·i+b)/m⌋. Geometric meaning: count lattice points below the line y=(a·x+b)/m for x=0..n-1. Reduce (n,m,a,b) to smaller scale by coordinate transforms: split (a/m)·n(n-1)/2 when a≥m, split (b/m)·n when b≥m, then for a<m,b<m apply a symmetry transform counting y·m < a·x+b. O(log m) recursion. BigInt supports large parameters. Distinct from the existing number-based floor-sum.',
  },
  tags: ['math', 'number-theory', 'euclidean', 'floor-sum'],
  complexity: { time: 'O(log m)', space: 'O(log m)' },
};
