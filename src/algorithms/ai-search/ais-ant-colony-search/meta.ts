// 蚁群算法（Ant Colony Optimization）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-ant-colony-search',
  categoryId: 'ai-search',
  title: { zh: '蚁群算法', en: 'Ant Colony Optimization' },
  summary: {
    zh: '蚂蚁依信息素与启发式选边，迭代更新信息素（小 TSP）。',
    en: 'Ants pick edges by pheromone + heuristic; pheromones update iteratively (small TSP).',
  },
  description: {
    zh: '蚁群算法（Dorigo 1992）：蚂蚁按 τ^α · η^β 概率选边构造路径；每轮结束后按 1/L 沉积、按 ρ 挥发信息素。本实现在 4 城 TSP 上演示。',
    en: 'ACO (Dorigo 1992): ants choose edges with probability proportional to τ^α · η^β; after each tour pheromones evaporate by ρ and deposit by 1/L. Demo on 4-city TSP.',
  },
  tags: ['ai-search', 'swarm', 'optimization', 'aco', 'tsp'],
  complexity: { time: 'O(iter × ants × n²)', space: 'O(n²)' },
};
