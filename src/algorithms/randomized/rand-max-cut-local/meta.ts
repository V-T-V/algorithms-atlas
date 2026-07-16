// 随机局部搜索 Max-Cut · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-max-cut-local',
  categoryId: 'randomized',
  title: { zh: '随机局部搜索 Max-Cut', en: 'Randomized Local-Search Max-Cut' },
  summary: { zh: '随机局部搜索求解 Max-Cut。', en: 'Randomized local search for Max-Cut.' },
  description: {
    zh: '翻改入边数多的顶点直到局部最优。',
    en: 'Flip vertex if more neighbors in same side.',
  },
  tags: ['randomized', 'graph'],
  complexity: { time: 'O(iterations·E)', space: 'O(V)' },
};
