// 组合目标和 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-combine-target',
  categoryId: 'backtracking',
  title: { zh: '组合目标和', en: 'Combination Sum to Target' },
  summary: {
    zh: '回溯找出所有和等于 target 的组合（数字可重复使用）。',
    en: 'Backtracking to find all combinations summing to target (elements reusable).',
  },
  description: {
    zh: '候选数组不含重复正整数，每个数可无限次使用。回溯时维护剩余 target，并从当前下标继续搜索以避免顺序重复。',
    en: 'Distinct positive candidates, each usable unlimited times. Track remaining target and continue search from current index to avoid ordering duplicates.',
  },
  tags: ['backtracking', 'combination'],
  complexity: { time: 'O(2^target)', space: 'O(target)' },
};
