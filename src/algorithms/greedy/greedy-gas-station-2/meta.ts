// 加油站 II（环路）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-gas-station-2',
  categoryId: 'greedy',
  title: { zh: '加油站 II（环路）', en: 'Gas Station II (Circuit)' },
  summary: {
    zh: '环形路 N 个加油站，求能跑完一圈的起始站下标。',
    en: 'N gas stations on a ring; find a starting index from which a full circuit is possible.',
  },
  description: {
    zh: '若总油量 ≥ 总油耗必有解。从 0 起累加净油量，一旦变负就把起点后移。',
    en: 'If total gas ≥ total cost a solution exists. Accumulate net from index 0; when negative, advance the start.',
  },
  tags: ['greedy'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
