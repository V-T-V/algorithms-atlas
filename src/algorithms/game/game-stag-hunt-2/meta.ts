// 猎鹿博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-stag-hunt-2',
  categoryId: 'game',
  title: { zh: '猎鹿博弈', en: 'Stag Hunt' },
  summary: {
    zh: '两人合作猎鹿收益最高（4,4），但单干猎兔保底（2,2）；存在两个纯纳什。',
    en: 'Cooperating on a stag yields (4,4); hunting a hare alone guarantees (2,2); two pure Nash equilibria.',
  },
  description: {
    zh: '猎鹿博弈（信任博弈）：行/列选 S(猎鹿) 或 H(猎兔)。\n矩阵：\n      S      H\n  S  4,4    0,2\n  H  2,0    2,2\n两个纯纳什：(S,S) 与 (H,H)；(S,S) 帕累托更优，(H,H) 风险占优。',
    en: 'Stag Hunt (trust game). Actions S(stag) or H(hare).\n      S      H\n  S  4,4    0,2\n  H  2,0    2,2\nTwo pure Nash: (S,S) and (H,H); (S,S) pareto-dominates, (H,H) risk-dominates.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
