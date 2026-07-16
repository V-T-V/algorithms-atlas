// 渐进偏置（Progressive Bias）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'progressive-bias',
  categoryId: 'ai-search',
  title: { zh: '渐进偏置', en: 'Progressive Bias' },
  summary: {
    zh: 'MCTS 初期用领域启发式给节点加偏置项，访问次数增加后让位给 UCB。',
    en: 'Inject a domain-heuristic bias into MCTS early on; cede to UCB as visits accumulate.',
  },
  description: {
    zh: '渐进偏置（Chaslot et al., 2006; Browne et al. 综述）在 MCTS 的选择公式中加入一个由「领域启发式」给定的偏置项 H(s,a)：\n\nUCB(s,a) + W · H(s,a) / (visits(s,a) + 1)\n\n初期 visits(s,a) 小，偏置项主导，使搜索沿「领域知识认为是好」的方向；随着 visits 增长，偏置项被 1/visits 衰减，让位给 UCB 的探索/利用估计。\n\n这非常适合「有领域知识但需要 MCTS 兜底」的场景（如围棋中基于棋型的启发）。本实现在 K-臂问题上模拟：每个臂有一个先验质量 H(a)，初期偏置把搜索导向高 H 的臂。',
    en: 'Progressive bias (Chaslot et al., 2006; reviewed in Browne et al.) adds a domain-heuristic term H(s,a) to the MCTS selection formula:\n\nUCB(s,a) + W · H(s,a) / (visits(s,a) + 1)\n\nWith few visits the bias dominates, steering search toward what the domain knowledge deems good; as visits grow the bias decays as 1/visits, ceding to the UCB explore/exploit estimate.\n\nIdeal when domain knowledge exists but MCTS must still take over (e.g. pattern-based heuristics in Go). This implementation simulates it on a K-armed bandit where each arm has a prior weight H(a).',
  },
  tags: ['ai-search', 'mcts', 'heuristic', 'progressive-bias'],
  complexity: { time: 'O(iterations · depth)', space: 'O(actions)' },
  references: [
    {
      label: 'Progressive Bias — Browne et al. MCTS Survey',
      url: 'https://www.cs.swansea.ac.uk/~cssimon/MCTS.pdf',
    },
  ],
};
