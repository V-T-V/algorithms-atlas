// 最大唯一字符拼接 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-max-length-unique-chars',
  categoryId: 'backtracking',
  title: { zh: '最大唯一字符拼接', en: 'Max Length of Unique Concatenation' },
  summary: {
    zh: '回溯选若干字符串拼接，使拼接结果字符全唯一，求最大长度。',
    en: 'Backtracking to choose strings to concatenate with all-unique characters, maximizing total length.',
  },
  description: {
    zh: '用位掩码记录已用字符。对每个字符串选或不选，仅当与已有字符不冲突时才选。',
    en: 'Use a bitmask of used characters. For each string choose include/exclude; include only when no character conflict exists.',
  },
  tags: ['backtracking', 'bitmask'],
  complexity: { time: 'O(2^n·k)', space: 'O(n)' },
};
