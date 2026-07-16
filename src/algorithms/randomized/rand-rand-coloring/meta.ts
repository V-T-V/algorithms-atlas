// 随机图着色 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-rand-coloring',
  categoryId: 'randomized',
  title: { zh: '随机图着色', en: 'Random Graph Coloring' },
  summary: { zh: '随机化启发式图着色。', en: 'Randomized heuristic graph coloring.' },
  description: { zh: '随机顺序贪心着色。', en: 'Greedy coloring in random order.' },
  tags: ['randomized', 'graph'],
  complexity: { time: 'O(V·d)', space: 'O(V)' },
};
