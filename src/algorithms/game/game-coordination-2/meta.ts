// 纯协调博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-coordination-2',
  categoryId: 'game',
  title: { zh: '纯协调博弈', en: 'Pure Coordination' },
  summary: {
    zh: '双方做同一选择即得奖励；两个等价纯纳什。',
    en: 'Both choosing the same action yields reward; two equivalent pure Nash.',
  },
  description: {
    zh: '纯协调博弈。行/列选 A 或 B。\n      A      B\n  A  2,2    0,0\n  B  0,0    2,2\n两个纯纳什：(A,A) 与 (B,B)；完全对称。',
    en: 'Pure coordination game. Actions A or B.\n      A      B\n  A  2,2    0,0\n  B  0,0    2,2\nTwo pure Nash: (A,A) and (B,B); fully symmetric.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
