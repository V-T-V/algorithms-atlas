// Hopscotch Hashing · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hopscotch-hashing',
  categoryId: 'hashing',
  title: { zh: 'Hopscotch 哈希', en: 'Hopscotch Hashing' },
  summary: {
    zh: '开放寻址 + 邻域约束：键必须落在 hash 后的 H 步窗口内，用位图记录。',
    en: 'Open addressing with a bounded neighborhood H: each key stays within H slots of its home, tracked by a bitmap.',
  },
  description: {
    zh: 'Hopscotch 哈希在开放寻址基础上加一条邻域约束：键 K 的 hash 位置为 home，则 K 必须落在 [home, home+H) 的窗口内（H 为邻域大小，常 32 或 64）。每个槽维护一个 H 位的「hop 信息」位图，记录哪些键的 home 是本槽。插入时若空槽超出窗口，则沿窗口内反向「挪动」已有键腾位（类似跳房子）。这样查找只需扫描固定 H 个槽，保证最坏 O(1) 查找；并发环境下也利于细粒度加锁。',
    en: 'Hopscotch hashing augments open addressing with a neighborhood constraint: a key K whose home is h must reside within the window [h, h+H) (H is the neighborhood size, typically 32 or 64). Each slot keeps an H-bit "hop information" bitmap recording which keys claim it as home. On insert, if the empty slot found lies outside the window, existing keys within the window are shifted backward ("hopscotched") to make room. Lookup therefore scans only H fixed slots, guaranteeing worst-case O(1); the locality also helps fine-grained locking under concurrency.',
  },
  tags: ['hashing', 'open-addressing', 'hash-table', 'concurrency'],
  complexity: { time: 'O(1) expected', space: 'O(n)' },
};
