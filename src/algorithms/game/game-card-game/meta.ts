// 纸牌游戏 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-card-game',
  categoryId: 'game',
  title: { zh: '纸牌游戏（两手比大小）', en: 'Card Game (Compare Two Hands)' },
  summary: {
    zh: '用极简扑克规则比较两手 5 张牌，返回较大者。',
    en: 'Compare two 5-card hands with simplified poker rules and return the winner.',
  },
  description: {
    zh: '每张牌用「点数-花色」表示。按牌型（同花顺/四条/葫芦/同花/顺子/三条/两对/一对/高牌）打分比较。',
    en: 'Each card is rank-suit. Score by hand category (straight flush / four of a kind / full house / flush / straight / trips / two pair / pair / high card).',
  },
  tags: ['game', 'cards', 'sorting'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
