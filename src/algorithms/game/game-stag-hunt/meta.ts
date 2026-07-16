// 猎鹿博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-stag-hunt',
  categoryId: 'game',
  title: { zh: '猎鹿博弈', en: 'Stag Hunt' },
  summary: {
    zh: '合作猎鹿收益高但需双方信任，单干猎兔保底。有两个纯纳什：(猎鹿,猎鹿) 与 (猎兔,猎兔)。',
    en: 'Cooperative stag hunt pays high but needs trust; hare is safe. Two pure Nash: (stag,stag) and (hare,hare).',
  },
  description: {
    zh: '双方都猎鹿得 4，都猎兔得 2；一方猎鹿一方猎兔时猎鹿者得 0、猎兔者得 2。存在收益占优与风险占优两个均衡。',
    en: 'Both stag → 4; both hare → 2; one stag one hare → stag gets 0, hare gets 2. Payoff-dominant and risk-dominant equilibria both exist.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
