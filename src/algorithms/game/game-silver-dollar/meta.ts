// 银币游戏 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-silver-dollar',
  categoryId: 'game',
  title: { zh: '银币游戏', en: 'Silver Dollar Game' },
  summary: {
    zh: '把硬币左移不可越过其它硬币，用相邻间隔异或和判定先手胜负。',
    en: 'Move coins left without crossing others; winner decided by XOR of adjacent gaps.',
  },
  description: {
    zh: '一排格子放若干硬币。每步把一枚硬币向左移若干格，但不能落到或越过另一枚硬币。把相邻间隔两两分组求异或和（Bogus Nim）。',
    en: 'Coins on a strip; each move slides a coin left without reaching/passing another. Pair up adjacent gaps and XOR them (Bogus Nim reduction).',
  },
  tags: ['game', 'combinatorial', 'nim'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
