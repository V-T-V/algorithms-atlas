// 回合制游戏框架 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-turn-based',
  categoryId: 'game',
  title: { zh: '回合制游戏框架', en: 'Turn-Based Game Framework' },
  summary: {
    zh: '通用 minimax 回合制求值框架，演示取石子到 K 的胜负判定。',
    en: 'A generic minimax turn-based evaluation framework, demonstrated on take-stones-to-K.',
  },
  description: {
    zh: '抽象状态 + 合法动作 + 终局评分接口，用极小化极大（minimax）求先手胜负。示例：剩 n 颗石子，每轮取 1..maxTake。',
    en: 'Abstract state + legal moves + terminal scoring, solved via minimax. Demo: n stones, take 1..maxTake each turn, taker of last wins.',
  },
  tags: ['game', 'minimax', 'framework'],
  complexity: { time: 'O(分支^深度)', space: 'O(深度)' },
};
