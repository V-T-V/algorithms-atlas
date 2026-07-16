// 随机采样 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-random-sampling',
  categoryId: 'randomized',
  title: { zh: '随机采样（无放回）', en: 'Random Sampling (without replacement)' },
  summary: {
    zh: '从 n 项中等概率无放回抽取 k 项，使用 Vitter 算法 R。',
    en: "Draw k of n items uniformly without replacement using Vitter's algorithm R.",
  },
  description: {
    zh: 'Vitter 算法 R：维护大小为 k 的蓄水池。前 k 项直接放入；对第 i（i>k）项以 k/i 概率选中，并随机替换池中一项。等概率无放回，O(n) 时间 O(k) 空间。',
    en: "Vitter's algorithm R: keep a reservoir of size k. Take the first k items directly; for item i>k accept with probability k/i, replacing a random slot. Uniform without replacement, O(n) time, O(k) space.",
  },
  tags: ['randomized', 'sampling', 'reservoir', 'vitter'],
  complexity: { time: 'O(n)', space: 'O(k)' },
};
