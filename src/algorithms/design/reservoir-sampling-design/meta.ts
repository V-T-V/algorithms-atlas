// 蓄水池抽样 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'reservoir-sampling-design',
  categoryId: 'design',
  title: { zh: '蓄水池抽样', en: 'Reservoir Sampling' },
  summary: {
    zh: '未知大小的流中 O(n) 等概率抽取 k 个样本，O(k) 空间。',
    en: 'Draw k uniform samples from an unknown-size stream in O(n) time, O(k) space.',
  },
  description: {
    zh: '经典 R 算法：从数据流中等概率抽取 k 个样本，无需事先知道总量 n。\n\n- 前 k 个元素直接放入蓄水池\n- 对第 i（i > k）个元素，以 k/i 概率保留它（替换蓄水池中随机一个位置）\n- 最终每个元素被选中的概率恰为 k/n\n\n证明：第 i 个元素最终在池中概率 = 它被选中 且 之后未被覆盖，连乘即 k/n。\n\n设计上代表「流式/未知 N」场景，是随机化设计的范式。',
    en: 'The classic R algorithm: draw k uniform samples from a stream without knowing n in advance.\n\n- First k elements fill the reservoir\n- For the i-th (i > k) element, keep it with probability k/i (replacing a random slot)\n- Each element ends up selected with probability exactly k/n\n\nProof: probability element i survives = kept AND never overwritten, telescopes to k/n.\n\nA paradigm of "streaming / unknown N" randomized design.',
  },
  tags: ['randomized', 'streaming', 'design-paradigm'],
  complexity: { time: 'O(n)', space: 'O(k)' },
};
