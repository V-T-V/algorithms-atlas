// 贪心边着色（Greedy Edge Coloring）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-edge-coloring',
  categoryId: 'greedy',
  title: { zh: '贪心边着色', en: 'Greedy Edge Coloring' },
  summary: {
    zh: '为每条边分配不同于邻接边的颜色，使用 Δ+1 色。',
    en: 'Assign each edge a color distinct from adjacent edges; uses at most Δ+1 colors.',
  },
  description: {
    zh: '贪心边着色：按边序，给每条边分配最小的、两端点未使用的颜色。Vizing 定理保证 ≤ Δ+1 色。',
    en: 'Greedy edge coloring: for each edge assign the smallest color unused at both endpoints. Vizing: <= Δ+1 colors.',
  },
  tags: ['greedy', 'graph-coloring', 'graph'],
  complexity: { time: 'O(|E|·Δ)', space: 'O(|E|)' },
};
