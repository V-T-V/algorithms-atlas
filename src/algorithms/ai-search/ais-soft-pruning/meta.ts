// 软剪枝（Soft Pruning）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-soft-pruning',
  categoryId: 'ai-search',
  title: { zh: '软剪枝', en: 'Soft Pruning' },
  summary: {
    zh: '软剪枝：容忍少量越界继续搜索，适合带噪声的评估函数。',
    en: 'Soft pruning: tolerate small out-of-window values, suited to noisy evaluation.',
  },
  description: {
    zh: '软剪枝放宽 alpha-beta：当子节点值越界但不超出「软阈值」(alpha - slack, beta + slack) 时继续搜索，仅记录软上下界；超出硬阈值才剪枝。\n\n适合蒙特卡洛叶值等噪声评估。',
    en: 'Soft pruning relaxes alpha-beta: when a child value is out of window but within (alpha - slack, beta + slack), keep searching and only record a soft bound; cut only beyond the hard threshold.\n\nSuited to noisy (e.g., Monte-Carlo) leaf evaluation.',
  },
  tags: ['ai-search', 'pruning', 'soft', 'game-tree'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
};
