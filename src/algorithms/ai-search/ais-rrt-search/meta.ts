// RRT 快速探索随机树（Rapidly-exploring Random Tree）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-rrt-search',
  categoryId: 'ai-search',
  title: { zh: 'RRT 快速探索随机树', en: 'Rapidly-exploring Random Tree' },
  summary: {
    zh: '随机增量式扩展运动规划树。',
    en: 'Incrementally grows a random tree for planning.',
  },
  description: {
    zh: 'RRT 每次随机采样一个点，找到树上最近节点并向采样点延伸固定步长，逐步覆盖自由空间，常用于非完整约束规划。',
    en: 'RRT samples a random point, finds the nearest tree node, extends by a fixed step; grows coverage of free space for planning.',
  },
  tags: ['ai-search', 'rrt', 'motion-planning', 'sampling'],
  complexity: { time: 'O(n) per step', space: 'O(n)' },
};
