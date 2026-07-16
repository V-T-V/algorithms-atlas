// Double Hashing · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'double-hashing',
  categoryId: 'hashing',
  title: { zh: '双重哈希', en: 'Double Hashing' },
  summary: {
    zh: '冲突时步长用第二个哈希函数 h2(k)，彻底消除聚集。',
    en: 'On collision step by a second hash function h2(k), eliminating clustering.',
  },
  description: {
    zh: '双重哈希（Double Hashing）是开放寻址法中冲突最均匀的策略：探测位置为 (h1(k) + i·h2(k)) % size，其中 h2 是与 h1 独立的第二个哈希函数。由于步长 h2(k) 随键变化，不同键走完全不同的探测路径，既消除主聚集又消除次聚集。要求 h2(k) 与 size 互质（通常 size 取素数且 h2 恒不为 0）。',
    en: 'Double hashing is the most uniformly distributed open-addressing collision strategy: probe positions are (h1(k) + i·h2(k)) % size, where h2 is an independent second hash. Because the step h2(k) varies per key, different keys follow distinct probe paths, eliminating both primary and secondary clustering. h2(k) must be coprime with size (typically size is prime and h2 is never 0).',
  },
  tags: ['hashing', 'open-addressing', 'probing'],
  complexity: { time: 'O(1) 期望 / O(n) 最坏', space: 'O(n)' },
};
