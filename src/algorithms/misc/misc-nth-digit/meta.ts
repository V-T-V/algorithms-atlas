// 第 N 位数字 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-nth-digit',
  categoryId: 'misc',
  title: { zh: '第 N 位数字', en: 'Nth Digit' },
  summary: {
    zh: '把 1,2,3,... 顺序连成 1234567891011...，求第 n 位数字（LeetCode 400）。',
    en: 'Concatenate 1,2,3,... into 1234567891011... and find the n-th digit (LeetCode 400).',
  },
  description: {
    zh: 'LeetCode 400 第 N 位数字：\n\n- 1~9 共 9 个 1 位数，10~99 共 90 个 2 位数，依此类推。\n- 跳过完整的位数段，定位到目标数字所属段。\n- 再在该段中定位具体数字和该数字的某一位。\n\n示例：第 11 位 = 0（来自 "10"）。',
    en: 'LeetCode 400 Nth Digit:\n\n- 1..9 are 9 one-digit numbers, 10..99 are 90 two-digit numbers, and so on.\n- Skip whole digit-length groups to locate the target group.\n- Then locate the exact number and the digit within it.\n\nExample: the 11th digit is 0 (from "10").',
  },
  tags: ['misc', 'math', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
