// 启发式评估函数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-heuristic-eval',
  categoryId: 'ai-search',
  title: { zh: '启发式评估函数 (静态评估)', en: 'Heuristic Evaluation Function' },
  summary: {
    zh: '为非终局局面打分：加权特征（如棋子数、机动性、控制）线性组合。',
    en: 'Score non-terminal positions by a weighted linear combination of features (material, mobility, control).',
  },
  description: {
    zh: '启发式评估函数（静态评估）是博弈搜索（minimax/alpha-beta）的核心组件。它对非终局局面返回一个数值估计，反映当前玩家优势。典型做法是设计若干特征（棋子物质、机动性、兵形、王安全等）并加权求和。本实现提供通用加权特征评估器，并演示一个简化国际象棋物质+机动性评估。',
    en: 'A heuristic evaluation function (static evaluation) is the core component of game search (minimax/alpha-beta). It returns a numeric estimate for non-terminal positions reflecting the current players advantage. A typical approach designs features (material, mobility, pawn structure, king safety) and sums them weighted. This implementation provides a general weighted-feature evaluator and demonstrates a simplified chess material+m mobility evaluation.',
  },
  tags: ['ai-search', 'evaluation', 'heuristic', 'game-search'],
  complexity: { time: 'O(f)', space: 'O(f)' },
};
