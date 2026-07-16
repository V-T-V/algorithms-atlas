// 最大瓶颈增广路 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-augmenting-path-longest',
  categoryId: 'network',
  title: { zh: '最大瓶颈增广路', en: 'Maximum-Bottleneck Augmenting Path' },
  summary: {
    zh: '每轮选取瓶颈容量最大的增广路（类似 Dijkstra 的最大带宽路径），加快收敛。',
    en: 'Each round pick the augmenting path with the largest bottleneck capacity (a widest-path / maximum-bandwidth variant of Dijkstra) to speed convergence.',
  },
  description: {
    zh: '最大瓶颈增广路：在残量图上每轮选择「最小边容量最大」的 s-t 路径（ widest path）。用类似 Dijkstra 的方法，以瓶颈容量为关键字做最大堆选择。该策略使每轮增广至少为当前最大流的 1/m，从而增广次数为 O(m·log U)，实践中比任意选路更快。',
    en: 'Maximum-bottleneck augmenting path: each round choose the s-t path whose minimum edge capacity is maximized (widest path). Use a Dijkstra-like method keyed on bottleneck capacity with a max-heap. Each augmentation carries at least 1/m of the remaining flow, giving O(m·log U) augmentations and faster convergence in practice than arbitrary path selection.',
  },
  tags: ['network', 'max-flow', 'augmenting-path', 'widest-path', 'dijkstra-variant'],
  complexity: { time: 'O(E²·log U)', space: 'O(V + E)' },
};
