// 别名法（加权离散采样）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-alias-2',
  categoryId: 'randomized',
  title: { zh: '别名法（加权离散采样）', en: 'Alias Method (Weighted Discrete Sampling)' },
  summary: {
    zh: 'O(n) 预处理后 O(1) 采样：每个槽位存放一个原项 + 一个别名，公平掷骰后二选一。',
    en: 'O(n) preprocessing then O(1) sampling: each slot holds an original item plus an alias; a fair roll then picks one of two.',
  },
  description: {
    zh: '别名法 (Walker 1974) 把任意离散概率分布压缩成 n 个等高（1/n）的列，每列最多两个原项（一个本体、一个别名）。构建时用大小两组栈：>1 的分给 <1 的，直至平衡。采样时随机选一列（概率 1/n），再以该列剩余高度为概率选本体或别名。',
    en: "The alias method (Walker 1974) compresses any discrete distribution into n equal-height (1/n) columns, each with at most two source items (an original and an alias). Construction uses small/large stacks: items >1 donate to items <1 until balanced. Sampling picks a column uniformly then chooses original vs alias by the column's remaining height.",
  },
  tags: ['randomized', 'sampling', 'weighted', 'alias'],
  complexity: { time: 'O(n) 预处理, O(1) 采样', space: 'O(n)' },
};
