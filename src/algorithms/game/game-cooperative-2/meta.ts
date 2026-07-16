// 合作博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-cooperative-2',
  categoryId: 'game',
  title: { zh: '合作博弈', en: 'Cooperative Game' },
  summary: {
    zh: '玩家可签约束协议；关注联盟与核心分配，而非个人策略。',
    en: 'Players can sign binding agreements; focuses on coalitions and core allocations rather than individual strategies.',
  },
  description: {
    zh: '合作博弈（联盟形式）。简化为 2 人分享：行/列选 C(合作) 或 N(不合作)。\n      C      N\n  C  5,5    0,2\n  N  2,0    1,1\n合作带来最高总剩余 10；纳什讨价还价解对称 (5,5)。',
    en: 'Cooperative game (coalitional form). Simplified 2-player split: actions C(cooperate) or N(not).\n      C      N\n  C  5,5    0,2\n  N  2,0    1,1\nCooperation yields max total surplus 10; symmetric Nash bargaining (5,5).',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
