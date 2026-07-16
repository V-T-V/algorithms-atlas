// Robin Hood 探查（Robin Hood Probing）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-robin-hood-probe',
  categoryId: 'hashing',
  title: { zh: 'Robin Hood 探查', en: 'Robin Hood Probing' },
  summary: {
    zh: '线性探查变体：插入时让"更富"(探查少)的元素让位给"更穷"的，均衡探查距离。',
    en: 'Linear-probe variant: on insert, evict a richer (closer) element to help a poorer one; balances probe distance.',
  },
  description: {
    zh: 'Robin Hood：探查时比较当前键的"到家的距离"，若新键更远则交换，劫富济贫使最大探查距离最小。',
    en: 'Robin Hood: compare probe distance to home; if the newcomer is farther, swap. Minimizes max probe distance.',
  },
  tags: ['hashing', 'hash-table', 'robin-hood'],
  complexity: { time: 'O(1) amortized', space: 'O(n)' },
};
