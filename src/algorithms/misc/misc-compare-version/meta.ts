// 比较版本号 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-compare-version',
  categoryId: 'misc',
  title: { zh: '比较版本号', en: 'Compare Version Numbers' },
  summary: {
    zh: '按点分修订号逐段数值比较两个版本字符串。',
    en: 'Compare two version strings segment by segment as numeric revision numbers.',
  },
  description: {
    zh: 'LeetCode 165 比较版本号：version 由点分修订号组成，按数值比较每段，缺省补 0。',
    en: 'LeetCode 165 Compare Version Numbers: versions are dot-separated revision numbers; compare each segment numerically, defaulting missing to 0.',
  },
  tags: ['misc', 'string', 'leetcode'],
  complexity: { time: 'O(n+m)', space: 'O(n+m)' },
};
