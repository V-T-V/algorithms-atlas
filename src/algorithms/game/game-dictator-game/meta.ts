// 独裁者博弈（Dictator Game）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-dictator-game',
  categoryId: 'game',
  title: { zh: '独裁者博弈', en: 'Dictator Game' },
  summary: {
    zh: '一人决定如何分配固定总额给沉默的接收者，衡量纯粹利他。',
    en: 'One player allocates a fixed sum to a silent recipient; measures pure altruism.',
  },
  description: {
    zh: '独裁者博弈：独裁者持 e，给接收者 g∈[0,e]。无策略交互（接收者无选择），实验揭示平均 g>0，违反纯自利。',
    en: 'Dictator game: dictator with e gives recipient g∈[0,e]. No strategic interaction (recipient passive); experiments show mean g>0, violating pure self-interest.',
  },
  tags: ['game', 'behavioral', 'fairness'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
