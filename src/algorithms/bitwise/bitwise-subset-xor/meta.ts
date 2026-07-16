// 子集异或和 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitwise-subset-xor',
  categoryId: 'bitwise',
  title: { zh: '子集异或和', en: 'Subset XOR Sum' },
  summary: {
    zh: '求所有子集的异或和之和；存在某位为 1 则贡献 n*2^(n-1)。',
    en: 'Sum of XOR over all subsets; each set bit contributes n*2^(n-1).',
  },
  description: {
    zh:
      '子集异或和（Subset XOR Sum）：给定数组，求其所有 2^n 个子集的「子集异或」之和。' +
      '\n逐位独立分析：对第 k 位，只要该位在数组中出现过 1，' +
      '所有子集中恰有一半子集使该位异或结果为 1。' +
      '\n- 设该位有 c 个 1（c ≥ 1）：贡献 = `2^k · 2^(n-1)`（与 c 无关，只看是否出现）。' +
      '\n- 综合所有位：answer = `OR(全部元素) · 2^(n-1)`。' +
      '\n时间 `O(n)`，空间 `O(1)`。',
    en:
      'Subset XOR Sum: given an array, sum the XOR-total over all 2^n subsets. ' +
      '\nAnalyze bit-by-bit: for bit k, if any element has that bit set, exactly half of all subsets ' +
      'make the XOR of bit k equal 1. ' +
      '\n- With c ≥ 1 ones at that bit: contribution = 2^k · 2^(n-1) (independent of c, only its presence). ' +
      '\n- Over all bits: answer = OR(all elements) · 2^(n-1). ' +
      'Time O(n), space O(1).',
  },
  tags: ['bitwise', 'xor', 'subset', 'combinatorics', 'O(n)'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
