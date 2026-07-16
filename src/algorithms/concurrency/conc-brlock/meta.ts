// Big Reader 锁（Big Reader Lock）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-brlock',
  categoryId: 'concurrency',
  title: { zh: 'Big Reader 锁', en: 'Big Reader Lock' },
  summary: {
    zh: 'BRLOCK：每 CPU 一个读计数器，避免读者缓存行争用。',
    en: 'BRLOCK: per-CPU reader counter to avoid reader cache-line contention.',
  },
  description: {
    zh: 'Big Reader Lock 给每个 CPU 分配独立的读计数器，读者只修改本地计数，避免多核间的缓存行乒乓；写者需汇总所有 CPU 计数。适合读极多写极少。',
    en: 'Big Reader Lock gives each CPU its own reader counter so readers modify only local state, avoiding cross-core cache-line ping-pong; writers must sum all CPU counters. Suited to read-heavy, write-rare workloads.',
  },
  tags: ['concurrency', 'lock', 'reader-writer', 'per-cpu', 'brlock'],
  complexity: { time: 'O(1) read / O(p) write', space: 'O(p)' },
};
