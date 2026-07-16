// 随机爬山（Stochastic Hill Climbing）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-stochastic-hill',
  categoryId: 'ai-search',
  title: { zh: '随机爬山', en: 'Stochastic Hill Climbing' },
  summary: { zh: '按概率接受更好邻居。', en: 'Probabilistically accepts uphill neighbors.' },
  description: {
    zh: '随机爬山从所有更优邻居中按某概率分布挑选一个移动，避免确定性贪心陷入固定路径。',
    en: 'Stochastic hill climbing picks an improving neighbor probabilistically, escaping deterministic greedy paths.',
  },
  tags: ['ai-search', 'hill-climbing', 'stochastic'],
  complexity: { time: 'O(s)', space: 'O(1)' },
};
