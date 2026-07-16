// Robin Hood Hashing · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'robin-hood-hashing',
  categoryId: 'hashing',
  title: { zh: 'Robin Hood 哈希', en: 'Robin Hood Hashing' },
  summary: {
    zh: '开放寻址中「劫富济贫」：探测时按 PSL 抢占更近的槽，降低最大探测长度。',
    en: 'Open addressing that "steals from the rich": displace by probe-length to flatten the worst-case probe distance.',
  },
  description: {
    zh: 'Robin Hood 哈希是开放寻址的变体。插入时记录每个键的探测序列长度（PSL，probe sequence length）；当待插入键的当前 PSL 大于槽中已存键的 PSL 时，把已存键「踢出」、待插入键占位，再为被踢出的键继续探测。这好比「劫富济贫」——把离 hash 位更近（PSL 小）的富裕键让位给离 hash 位更远（PSL 大）的贫键，从而把探测长度的方差压低、最大 PSL 控制 O(log n) 级别，查找最坏情况更稳。',
    en: 'Robin Hood hashing is an open-addressing variant. Each stored key carries its probe sequence length (PSL). On insert, if the incoming key\'s current PSL exceeds the resident key\'s PSL, the resident is evicted and the incoming takes the slot, then insertion continues for the evicted key. This "robs the rich to feed the poor": keys close to their home (low PSL) yield to keys far from theirs (high PSL), flattening probe-length variance and bounding the maximum PSL to about O(log n), stabilizing worst-case lookups.',
  },
  tags: ['hashing', 'open-addressing', 'hash-table'],
  complexity: { time: 'O(1) amortized', space: 'O(n)' },
};
