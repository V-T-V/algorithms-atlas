// Weighted Reservoir Sampling (A-Res) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'reservoir-weighted',
  categoryId: 'randomized',
  title: { zh: '加权蓄水池抽样 (A-Res)', en: 'Weighted Reservoir Sampling (A-Res)' },
  summary: {
    zh: '流式抽样 k 个：每项按权重 w 算优先级 u^(1/w)，保留最大的 k 个。',
    en: 'Stream sampling of k items: each item gets priority u^(1/w); keep the top k.',
  },
  description: {
    zh: '加权蓄水池抽样（A-Res 算法，Efraimidis & Spirakis 2006）在不知道流总长度、且每项带权重 w_i 的情况下，等概率（按权重比例）抽取 k 个样本。核心思想：对每个到达的项，生成 u ~ Uniform(0,1)，计算优先级 key = u^(1/w_i)（权重越大，key 越倾向于大）；用一个最小堆维护当前最大的 k 个 key。当项数 > k 时，新项若 key 大于堆顶则替换。最终堆中 k 项即为按权重加权无放回抽样的结果。一次遍历、O(n log k) 时间、O(k) 内存。',
    en: 'Weighted reservoir sampling (the A-Res algorithm, Efraimidis & Spirakis 2006) draws k items from a stream of unknown length where each item carries a weight w_i, sampled without replacement proportionally to weight. The core idea: for each arriving item, draw u ~ Uniform(0,1) and compute the priority key = u^(1/w_i) (larger weights push keys higher); keep a min-heap of the top-k largest keys. Once more than k items have arrived, a new item whose key exceeds the heap minimum replaces it. The k items left in the heap are a weighted-without-replacement sample. It runs in one pass, O(n log k) time, O(k) memory.',
  },
  tags: ['randomized', 'sampling', 'streaming', 'weighted'],
  complexity: { time: 'O(n log k)', space: 'O(k)' },
};
