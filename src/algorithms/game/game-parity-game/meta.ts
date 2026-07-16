// 奇偶博弈（Parity Game）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-parity-game',
  categoryId: 'game',
  title: { zh: '奇偶博弈', en: 'Parity Game' },
  summary: {
    zh: '节点带优先级，玩家 Even/Odd 使最终优先级为偶/奇，验证 μ-演算模型检测。',
    en: 'Nodes carry priorities; Even/Odd make the final priority even/odd; underpins μ-calculus model checking.',
  },
  description: {
    zh: '奇偶博弈：每个节点有优先级 d(v)。Even 想无限 play 中最大出现的优先级为偶，Odd 想为奇。是 PTIME∩NP 问题。',
    en: 'Parity game: each node has priority d(v). Even wants the max priority seen infinitely often to be even, Odd wants odd. Decidable in quasi-poly.',
  },
  tags: ['game', 'graph', 'verification'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
