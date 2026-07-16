import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-edge-coloring',
  categoryId: 'graph',
  title: { zh: '边着色（贪心）', en: 'Edge Coloring (Greedy)' },
  summary: {
    zh: '为每条边分配颜色使相邻边不同色，贪心用 Δ 或 Δ+1 种色。',
    en: 'Assign colors to edges so adjacent edges differ; greedy uses Δ or Δ+1 colors.',
  },
  description: {
    zh: '边着色：给每条边分配颜色，使得共享端点的边（相邻边）颜色不同。最少所需颜色数（边色数 χ′）满足 Δ ≤ χ′ ≤ Δ+1（Vizing 定理）。本实现用贪心：按边顺序，为每条边选最小的不与其已着色邻边冲突的颜色，使用不超过 2Δ-1 种色（实用上界）。时间 O(E·Δ)，空间 O(E)。',
    en: 'Edge coloring: adjacent edges (sharing an endpoint) must differ. Vizing: Δ <= χ′ <= Δ+1. Greedy per-edge picks smallest non-conflicting color. Time O(E·Δ), space O(E).',
  },
  tags: ['graph', 'edge-coloring', 'coloring', 'greedy'],
  complexity: { time: 'O(E·Δ)', space: 'O(E)' },
};
