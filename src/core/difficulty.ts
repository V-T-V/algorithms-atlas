// =============================================================================
// 算法难度评级
// 根据 categoryId、tags、complexity 自动推断难度等级。
// =============================================================================

import type { AlgorithmMeta } from '../types.ts';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export const DIFFICULTY_LABELS: Record<Difficulty, { zh: string; en: string }> = {
  beginner: { zh: '入门', en: 'Beginner' },
  intermediate: { zh: '进阶', en: 'Intermediate' },
  advanced: { zh: '竞赛', en: 'Advanced' },
};

/** 竞赛级标签关键词 */
const ADVANCED_TAGS = new Set([
  'fft', 'ntt', 'suffix-automaton', 'palindrome-tree', 'heavy-light-decomposition',
  'centroid-decomposition', 'virtual-tree', 'persistent-segment', 'li-chao',
  'sprague-grundy', 'min_25', 'du-sieve', 'alien-trick', 'sos-dp',
  'convex-hull-trick', 'divide-conquer-dp', 'knuth-optimization', 'slope-trick',
  'wavelet-tree', 'mergeable-segment', 'ex-lucas', 'mobius-inversion',
]);

/** 入门级类别 */
const BEGINNER_CATS = new Set(['sorting', 'searching', 'list', 'bitwise', 'misc']);

/** 根据元数据推断难度。 */
export function inferDifficulty(meta: AlgorithmMeta): Difficulty {
  const tagsLower = meta.tags.map((t) => t.toLowerCase());

  // 有竞赛级标签 → advanced
  if (tagsLower.some((t) => ADVANCED_TAGS.has(t))) return 'advanced';

  // 高复杂度 → advanced
  const time = meta.complexity.time.toLowerCase();
  if (time.includes('n^2') || time.includes('n²') || time.includes('n!') || time.includes('2^n') || time.includes('2ⁿ')) {
    // 高复杂度但不一定是竞赛级，标 intermediate
    return 'intermediate';
  }

  // 入门类别 + 简单标签 → beginner
  if (BEGINNER_CATS.has(meta.categoryId) && meta.tags.length <= 3) {
    return 'beginner';
  }

  // graph/dp/string/math 等核心算法 → intermediate
  if (['graph', 'dp', 'string', 'math', 'tree', 'geometry', 'backtracking'].includes(meta.categoryId)) {
    return 'intermediate';
  }

  // 默认 intermediate
  return 'intermediate';
}
