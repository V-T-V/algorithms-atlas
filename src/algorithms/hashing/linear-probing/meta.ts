// Linear Probing Hash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'linear-probing',
  categoryId: 'hashing',
  title: { zh: '线性探测哈希', en: 'Linear Probing Hash' },
  summary: {
    zh: '冲突时顺次探测下一槽 (i+1, i+2, …)，遇到空槽即落位。',
    en: 'On collision probe the next slot (i+1, i+2, …) until an empty slot is found.',
  },
  description: {
    zh: '线性探测（Linear Probing）是开放寻址法最简单的冲突策略：当哈希位置被占用时，按 h(k)+1, h(k)+2, … 逐个向后探测，直到遇到空槽。优点是缓存友好（连续访问），缺点是易产生「主聚集」（primary clustering）——长连续占用段会越聚越长。',
    en: 'Linear probing is the simplest open-addressing collision strategy: when the hashed slot is occupied, scan h(k)+1, h(k)+2, … until an empty slot is found. It is cache friendly but suffers from primary clustering, where long runs of occupied slots grow longer over time.',
  },
  tags: ['hashing', 'open-addressing', 'probing'],
  complexity: { time: 'O(1) 期望 / O(n) 最坏', space: 'O(n)' },
};
