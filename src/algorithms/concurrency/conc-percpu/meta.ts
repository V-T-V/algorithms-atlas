// 每 CPU 计数器（Per-CPU Counter）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-percpu',
  categoryId: 'concurrency',
  title: { zh: '每 CPU 计数器', en: 'Per-CPU Counter' },
  summary: {
    zh: 'Per-CPU 计数器：本地无锁累加，汇总时求和。',
    en: 'Per-CPU counter: lockless local increment, sum on demand.',
  },
  description: {
    zh: '每 CPU 计数器将计数分散到各 CPU 本地变量，避免原子操作争用；需要精确值时汇总所有 CPU。',
    en: 'Per-CPU counters spread increments across per-CPU local variables, avoiding atomic-op contention; the exact value is obtained by summing all CPUs.',
  },
  tags: ['concurrency', 'counter', 'per-cpu', 'lockless'],
  complexity: { time: 'O(1) inc / O(p) sum', space: 'O(p)' },
};
