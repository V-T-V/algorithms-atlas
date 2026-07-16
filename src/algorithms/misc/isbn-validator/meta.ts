// ISBN-10 校验 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'isbn-validator',
  categoryId: 'misc',
  title: { zh: 'ISBN-10 校验', en: 'ISBN-10 Validator' },
  summary: {
    zh: '前 9 位加权（10..2）求和，校验位使总和被 11 整除。',
    en: 'Weight the first 9 digits by 10..2; the check digit makes the sum divisible by 11.',
  },
  description: {
    zh: 'ISBN-10 校验码算法：一个 10 位标识符，前 9 位是数字，第 10 位是校验位（可为 0-9 或 X 表示 10）。\n\n校验规则：\n\n  sum = Σ d_i · (11 - i)，i = 1..10（即权重 10,9,...,2,1）\n  合法当且仅当 sum mod 11 == 0\n\n校验位计算：d_10 = (11 - (Σ前9位·权重) mod 11) mod 11，结果 10 用 X 表示。可探测任意单字符错误及大多数字符互换。',
    en: 'ISBN-10 check-digit algorithm: a 10-character identifier where the first 9 are digits and the 10th is a check digit (0-9, or X meaning 10).\n\nRule:\n\n  sum = Σ d_i · (11 - i), i = 1..10 (weights 10,9,...,2,1)\n  valid iff sum mod 11 == 0\n\nCheck digit: d_10 = (11 - (Σ first 9 · weights) mod 11) mod 11, with 10 written as X. Detects any single-character error and most transpositions.',
  },
  tags: ['checksum', 'validation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
