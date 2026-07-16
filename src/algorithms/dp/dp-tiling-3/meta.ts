import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-tiling-3',
  categoryId: 'dp',
  title: { zh: '多米诺三联铺砖', en: 'Domino & Tromino Tiling' },
  summary: {
    zh: '用 2×1 多米诺和 L 型三联骨牌铺满 2×n 板，求方案数。',
    en: 'Tile a 2xn board with dominos and L-trominoes; count ways modulo 1e9+7.',
  },
  description: {
    zh: 'LeetCode 790。状态机：f=完全填满前 i 列；p=前 i 列多出一格。f[i]=f[i-1]+f[i-2]+2·p[i-1]；p[i]=p[i-1]+f[i-2]。',
    en: 'LC 790. State machine f (fully covered), p (one extra). f[i]=f[i-1]+f[i-2]+2p[i-1]; p[i]=p[i-1]+f[i-2].',
  },
  tags: ['dp', 'tiling', 'state-machine'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
