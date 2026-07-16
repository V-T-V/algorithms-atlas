// 加权随机选择 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-weighted-random',
  categoryId: 'randomized',
  title: { zh: '加权随机选择', en: 'Weighted Random Choice' },
  summary: {
    zh: '按权重比例抽一个索引：累计权重二分搜索。',
    en: 'Pick an index proportional to its weight via cumulative-weight binary search.',
  },
  description: {
    zh: '加权随机：先求前缀和 S，再生成 r∈[0,S)，二分找首个前缀和 > r 的位置。等价于轮盘赌选择。O(n) 预处理 + O(log n) 单次抽取。',
    en: 'Weighted random: compute prefix sums S, draw r∈[0,S), binary search the first prefix exceeding r. Equivalent to roulette-wheel selection. O(n) preprocess, O(log n) per draw.',
  },
  tags: ['randomized', 'weighted', 'roulette-wheel', 'binary-search'],
  complexity: { time: 'O(n) 预处理 / O(log n) 抽取', space: 'O(n)' },
};
