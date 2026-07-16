// 组合 C(n,k) · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-combine',
  categoryId: 'backtracking',
  title: { zh: '组合 C(n,k)', en: 'Combinations' },
  summary: {
    zh: '回溯枚举从 1..n 中选 k 个的所有组合。',
    en: 'Backtracking to enumerate C(n,k) combinations.',
  },
  description: {
    zh: '从 1 到 n 中选出 k 个数的所有组合。回溯维护一个起点 start，避免产生排列式的重复。',
    en: 'All k-combinations chosen from 1..n. Backtracking maintains a start index to avoid permutation-style duplicates.',
  },
  tags: ['backtracking', 'combination'],
  complexity: { time: 'O(C(n,k)·k)', space: 'O(k)' },
};
