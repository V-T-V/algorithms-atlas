// Quadratic Probing Hash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'quadratic-probing',
  categoryId: 'hashing',
  title: { zh: '二次探测哈希', en: 'Quadratic Probing Hash' },
  summary: {
    zh: '冲突时探测 h+i² (i=1,2,3,…) 避免线性主聚集。',
    en: 'On collision probe h+i² (i=1,2,3,…) to avoid primary clustering.',
  },
  description: {
    zh: '二次探测（Quadratic Probing）改进线性探测：探测序列为 h(k), h(k)+1², h(k)+2², h(k)+3², …。由于跳过的距离随探测次数平方增长，避免了线性的主聚集（primary clustering），但仍存在较弱的次聚集（secondary clustering）——哈希值相同的键走完全相同的探测路径。',
    en: 'Quadratic probing improves on linear probing: the probe sequence is h(k), h(k)+1², h(k)+2², h(k)+3², …. Because the jump grows quadratically it avoids primary clustering, but still suffers from weaker secondary clustering: keys with the same hash follow identical probe paths.',
  },
  tags: ['hashing', 'open-addressing', 'probing'],
  complexity: { time: 'O(1) 期望 / O(n) 最坏', space: 'O(n)' },
};
