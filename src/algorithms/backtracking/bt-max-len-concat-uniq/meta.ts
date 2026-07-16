// 拼接最大唯一串 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-max-len-concat-uniq',
  categoryId: 'backtracking',
  title: { zh: '拼接最大唯一串', en: 'Max Length of Concatenated Unique' },
  summary: {
    zh: '从字符串数组选若干拼接，使字符唯一且最长。',
    en: 'Pick strings to concatenate with all unique chars, maximize length.',
  },
  description: { zh: '回溯选/不选，位掩码判重。', en: 'Backtrack with bitmask. O(2^n).' },
  tags: ['backtracking', 'bitmask'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
