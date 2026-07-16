// 组合总和 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-combination-sum',
  categoryId: 'backtracking',
  title: { zh: '组合总和', en: 'Combination Sum' },
  summary: {
    zh: '从无重复正整数候选中选若干（可重复）使和为 target。',
    en: 'Pick candidates (with repeat) summing to target.',
  },
  description: { zh: '回溯，允许同元素重复使用。', en: 'Backtrack, allow reuse. O(n^(t/m)).' },
  tags: ['backtracking', 'combination'],
  complexity: { time: 'O(n^(t/m))', space: 'O(t/m)' },
};
