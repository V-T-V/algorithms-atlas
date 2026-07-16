// 蓄水池抽样 (Algorithm R) · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-reservoir-2',
  categoryId: 'randomized',
  title: { zh: '蓄水池抽样 (Algorithm R)', en: 'Reservoir Sampling (Algorithm R)' },
  summary: {
    zh: '对未知大小流式数据等概率抽取 k 个样本，每个元素被选概率 k/n。',
    en: 'Sample k items uniformly from a stream of unknown size; each element selected with probability k/n.',
  },
  description: {
    zh: 'Algorithm R：前 k 个元素直接放入蓄水池。对第 i (i≥k) 个元素，生成随机 j ∈ [0,i]，若 j < k 则用第 i 个元素替换蓄水池[j]。可证明每个元素最终在蓄水池中的概率恰为 k/n。适用于无法全部装入内存的大数据流。',
    en: 'Algorithm R: put the first k elements into the reservoir. For element i (i>=k), draw random j in [0,i); if j < k, replace reservoir[j] with element i. Each element ends up in the reservoir with probability exactly k/n. Suits data streams too large to fit in memory.',
  },
  tags: ['randomized', 'sampling', 'stream', 'reservoir'],
  complexity: { time: 'O(n)', space: 'O(k)' },
};
