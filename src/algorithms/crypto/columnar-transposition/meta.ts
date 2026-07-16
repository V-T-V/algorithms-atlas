// 列置换密码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'columnar-transposition',
  categoryId: 'crypto',
  title: { zh: '列置换密码', en: 'Columnar Transposition Cipher' },
  summary: {
    zh: '按密钥字母顺序重排列，再逐列读取。',
    en: 'Writes text into rows, reorders columns by the key, then reads column by column.',
  },
  description: {
    zh: '列置换密码把明文按行填入宽度=密钥长度的矩阵，再按密钥字母的排序结果重新排列各列，最后自上而下逐列读出密文。解密按列序与行数反向还原。它只改变字符位置，不改变字符本身。',
    en: 'The columnar transposition cipher writes plaintext row-wise into a matrix whose width equals the key length, then reorders columns by the alphabetic rank of the key letters, and finally reads out the ciphertext column by column. Decryption inverts this. Only positions change, not letters.',
  },
  tags: ['crypto', 'transposition', 'classical'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
