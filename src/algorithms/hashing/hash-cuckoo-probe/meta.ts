// 布谷鸟探查（Cuckoo Probe Sequence）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-cuckoo-probe',
  categoryId: 'hashing',
  title: { zh: '布谷鸟探查', en: 'Cuckoo Probe Sequence' },
  summary: {
    zh: '模拟布谷鸟哈希插入的踢出链，分析失败阈值。',
    en: 'Simulate the eviction chain during cuckoo-hash insertion; analyze the failure threshold.',
  },
  description: {
    zh: '布谷鸟哈希：每键两个哈希位置，插入时若满则踢出对方到其另一位置，形成链。链过长则需 rehash。',
    en: 'Cuckoo hashing: two hash slots per key; insert evicts the occupant to its other slot, forming a chain.',
  },
  tags: ['hashing', 'hash-table', 'cuckoo'],
  complexity: { time: 'O(1) amortized', space: 'O(n)' },
};
