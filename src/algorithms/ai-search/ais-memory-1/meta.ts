// 单层记忆博弈搜索 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-memory-1',
  categoryId: 'ai-search',
  title: { zh: '单层记忆博弈搜索 (Memory-1)', en: 'Memory-1 Game Search' },
  summary: {
    zh: 'Memory-1 博弈：玩家只知道上一回合双方动作，用不动点方程求稳态策略值。',
    en: 'Memory-1 games: players recall only the last round of joint actions; solve fixed-point equations for steady-state values.',
  },
  description: {
    zh: 'Memory-1 博弈（如重复囚徒困境变体）中，每个玩家策略只依赖上一回合的联合动作。用值迭代求不动点：V(s) = 对动作 a 求和 [R(s,a) + gamma*V(sNew)]，其中 sNew 是新状态（上一回合动作）。本实现求解一个 2x2 重复博弈（ITM/Press-Dyson 框架）的稳态价值。',
    en: 'In memory-1 games (e.g. iterated prisoners dilemma variants), each players policy depends only on the last rounds joint action. Solve via value iteration to a fixed point: V(s) = sum over actions a of [R(s,a) + gamma*V(sNew)], where sNew is the new state (last action). This implementation solves the steady-state value of a 2x2 repeated game (ITM / Press-Dyson framework).',
  },
  tags: ['ai-search', 'memory-1', 'game-theory', 'repeated-game', 'fixed-point'],
  complexity: { time: 'O(|S|²·k)', space: 'O(|S|)' },
};
