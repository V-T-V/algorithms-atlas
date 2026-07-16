// 排列排序 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'permutation-sort',
  categoryId: 'sorting',
  title: { zh: '排列排序', en: 'Permutation Sort' },
  summary: {
    zh: '穷举所有排列，找到第一个有序者（Bogo 的确定性变种）。',
    en: 'Enumerate all permutations until the first sorted one is found.',
  },
  description: {
    zh:
      '排列排序（Permutation Sort）是 Bogo Sort 的确定性变种：' +
      '\n- 通过字典序逐个生成全排列，检查每个排列是否有序。' +
      '\n- 找到第一个有序排列即返回。' +
      '\n- 严格确定性（不依赖随机数），最坏需要检查 n! 个排列。' +
      '\n仅作教学/演示用途，**不可用于生产**。时间 `O(n!)`，空间 `O(n)`（除克隆外）。',
    en:
      'Permutation Sort is the deterministic cousin of Bogo Sort: ' +
      '\n- Generate permutations in lexicographic order, test each for sortedness. ' +
      '\n- Return the first sorted one. ' +
      '\n- Strictly deterministic (no RNG); may inspect up to n! permutations. ' +
      'Educational only — never use in production. Time O(n!), space O(n) beyond the clone.',
  },
  tags: ['sorting', 'permutation', 'brute-force', 'deterministic', 'educational'],
  complexity: { time: 'O(n!)', space: 'O(n)' },
};
