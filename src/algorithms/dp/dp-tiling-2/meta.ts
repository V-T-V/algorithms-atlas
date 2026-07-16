import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-tiling-2',
  categoryId: 'dp',
  title: { zh: '2×N 铺砖', en: 'Domino Tiling 2×N' },
  summary: {
    zh: '用 1×2 多米诺铺满 2×N 网格的方案数（斐波那契）。',
    en: 'Number of ways to tile a 2×N grid with 1×2 dominoes (Fibonacci).',
  },
  description: {
    zh: '2×N 网格用 1×2 多米诺骨牌（可横放或竖放）铺满的方案数。设 f(n) 为方案数。考虑最左列：竖放一块 1×2 占据最左一列 → 剩余 2×(n-1)；或横放两块占最左两列 → 剩余 2×(n-2)。故 f(n)=f(n-1)+f(n-2)，f(0)=1,f(1)=1，即斐波那契数列偏移。时间 O(n)，空间 O(1)。',
    en: 'Tile 2×N grid with 1×2 dominoes. f(n)=f(n-1)+f(n-2): place one vertical (leaves n-1) or two horizontal (leaves n-2). Fibonacci. Time O(n), space O(1).',
  },
  tags: ['dp', 'tiling', 'fibonacci', 'combinatorics'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
