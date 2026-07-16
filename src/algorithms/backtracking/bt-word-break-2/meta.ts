// 单词拆分II · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-word-break-2',
  categoryId: 'backtracking',
  title: { zh: '单词拆分II', en: 'Word Break II' },
  summary: {
    zh: '把字符串拆成字典词的所有句子。',
    en: 'All sentences splitting string into dictionary words.',
  },
  description: { zh: '回溯切词，记录路径。', en: 'Backtrack word prefixes. O(2^n).' },
  tags: ['backtracking', 'string'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
