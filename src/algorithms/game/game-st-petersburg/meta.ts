// 圣彼得堡悖论（St. Petersburg Paradox）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-st-petersburg',
  categoryId: 'game',
  title: { zh: '圣彼得堡悖论', en: 'St. Petersburg Paradox' },
  summary: {
    zh: '抛硬币首次正面回合奖金翻倍，期望无穷但人们只愿付有限金额。',
    en: 'Coin flips double the prize each round until first heads; expected value is infinite yet people pay finite.',
  },
  description: {
    zh: '圣彼得堡：第 n 次首次正面奖金 2^n，期望 Σ 2^n*(1/2^n)=∞。引入对数效用或风险厌恶可解释有限估值。',
    en: 'St. Petersburg: prize 2^n on first heads at toss n; EV=Σ2^n/2^n=∞. Log utility or risk aversion yields finite valuation.',
  },
  tags: ['game', 'decision-theory', 'paradox'],
  complexity: { time: 'O(N)', space: 'O(1)' },
};
