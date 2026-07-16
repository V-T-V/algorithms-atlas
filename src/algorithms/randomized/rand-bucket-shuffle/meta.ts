// 桶洗牌 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-bucket-shuffle',
  categoryId: 'randomized',
  title: { zh: '桶洗牌', en: 'Bucket Shuffle' },
  summary: {
    zh: '把元素按随机键分到桶再串接，实现均匀随机置换。',
    en: 'Assign each element a random key, bucket by key, then concatenate to get a uniform shuffle.',
  },
  description: {
    zh: '桶洗牌：给每个元素附一个随机浮点键，按键值分桶排序后顺序输出。本质等价于「随机优先级排序」，用桶代替比较排序可达到 O(n) 期望。',
    en: 'Bucket shuffle: attach a random float key to each element, bucket-sort by key, then output in order. Equivalent to sorting by random priority; using buckets instead of comparison gives expected O(n).',
  },
  tags: ['randomized', 'shuffle', 'bucket', 'permutation'],
  complexity: { time: 'O(n) 期望', space: 'O(n)' },
};
