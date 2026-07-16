// ADFGVX 密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-adfgvx',
  categoryId: 'crypto',
  title: { zh: 'ADFGVX 密码', en: 'ADFGVX Cipher' },
  summary: {
    zh: '一战德军密码：6×6 方阵（A-Z+0-9）把字符分数化为两个标签，再做列置换。',
    en: 'WWI German cipher: a 6×6 grid (A-Z, 0-9) fractionates each char into two labels, then columnar transposition.',
  },
  description: {
    zh: '步骤1：字符 → (行标,列标) 两字符，标签取自 ADFGVX；步骤2：拼接后按密钥列置换重排。',
    en: 'Step 1: char → (rowLabel, colLabel) from ADFGVX. Step 2: concatenate, then columnar-transpose by key.',
  },
  tags: ['crypto', 'fractionation', 'transposition'],
  complexity: { time: 'O(n·log n)', space: 'O(n)' },
};
