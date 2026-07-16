// 基思数（Keith Number）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-keith-number',
  categoryId: 'misc',
  title: { zh: '基思数', en: 'Keith Number' },
  summary: {
    zh: '用自身各位数字做斐波那契式累加能回到自身的数，如 14, 19, 197。',
    en: 'Fibonacci-like sum of its own digits returns to itself, e.g. 14, 19, 197.',
  },
  description: {
    zh: '基思数：n 的各位 d_1..d_k 作为初始项，每项=前 k 项之和，序列中出现 n 则为基思数。',
    en: 'Keith number: digits d_1..d_k as seeds, each term = sum of previous k; if n appears in the sequence.',
  },
  tags: ['misc', 'number-theory', 'sequence'],
  complexity: { time: 'O(log n · log n)', space: 'O(log n)' },
};
