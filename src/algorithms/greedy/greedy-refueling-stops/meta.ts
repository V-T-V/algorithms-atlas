// 加油站停靠 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-refueling-stops',
  categoryId: 'greedy',
  title: { zh: '加油站停靠（最少次数）', en: 'Minimum Number of Refueling Stops' },
  summary: {
    zh: '汽车油箱有限，沿途有加油站，求到达终点最少加油次数。',
    en: 'Car with limited tank and stations along the way; find the minimum refuels to reach the target.',
  },
  description: {
    zh: '用最大堆：沿途把可加油站油量入堆，油不够时从堆顶取最大油量补充，计数。',
    en: 'Max-heap: push reachable station fuels; when out of fuel, pop the largest fuel to refill, count stops.',
  },
  tags: ['greedy', 'heap'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
