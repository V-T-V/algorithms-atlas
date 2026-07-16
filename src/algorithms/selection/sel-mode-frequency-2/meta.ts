// 众数频率变种 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-mode-frequency-2',
  categoryId: 'selection',
  title: { zh: '众数与频率（Boyer-Moore 多数）', en: 'Mode and Frequency (Boyer-Moore Majority)' },
  summary: {
    zh: 'Boyer-Moore 多数投票找多数元素 + 哈希频率统计众数。',
    en: 'Boyer-Moore majority vote for the majority element plus hash-map frequency for the mode.',
  },
  description: {
    zh: '本变种同时演示两种众数法：1) Boyer-Moore 投票在 O(n) 时间 O(1) 空间找「超过 n/2 的多数元素」；2) 哈希频率统计找任意众数（频次最高者）。',
    en: 'This variant demonstrates two mode methods: 1) Boyer-Moore vote finds the >n/2 majority element in O(n) time and O(1) space; 2) hash-map frequencies find the general mode (highest frequency).',
  },
  tags: ['selection', 'mode', 'boyer-moore', 'frequency'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
