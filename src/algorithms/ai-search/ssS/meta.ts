// 解状态空间搜索（Solution-State Space Search, SSS*）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ssS',
  categoryId: 'ai-search',
  title: { zh: '解状态空间搜索 SSS*', en: 'Solution-State Space Search (SSS*)' },
  summary: {
    zh: 'Stockman 的 SSS*：最佳优先遍历博弈树的状态空间，理论节点数 ≤ α-β。',
    en: "Stockman's SSS*: best-first traversal of game-tree state space; theoretically examines no more nodes than alpha-beta.",
  },
  description: {
    zh: 'SSS*（Stockman, 1979）是一种博弈树搜索算法，**最佳优先**地遍历树的「状态空间」（每个状态 = 树中某个节点 + 一个上界 `g`）。它维护一个 OPEN 优先队列（按 `g` 降序），反复取出队首状态处理：\n\n- **叶子状态**：将其上界 `g` 收紧为实际 utility（min 后回传给父节点）。\n- **已解决节点**：标记为 solved，向上传播。\n- **MAX 节点**：生成所有未解决子节点的状态（继承 `g`）。\n- **MIN 节点**：先生成「第一个」子节点的状态；只有当它被解决后才推进到下一个。\n\n理论上 SSS* 检查的叶子数 **不多于** α-β（在相同走法排序下），但内存占用更大、实现更复杂。本实现用简化的「优先队列 + 节点状态」模型在数值博弈树上工作，根值与 α-β 一致。',
    en: 'SSS* (Stockman, 1979) is a game-tree search that best-first traverses the tree\'s *state space* (each state = a node + an upper bound `g`). It keeps an OPEN priority queue (ordered by descending `g`), repeatedly popping the head:\n\n- **Leaf state**: tighten `g` to the actual utility.\n- **Solved node**: mark solved, propagate upward.\n- **MAX node**: generate states for all unsolved children (inheriting `g`).\n- **MIN node**: generate a state for the *first* child; only advance to the next when that child is solved.\n\nTheoretically SSS* examines no more leaves than alpha-beta (with the same move ordering), at the cost of higher memory and complexity. This implementation uses a simplified "queue + node state" model on a numeric game tree; its root value matches alpha-beta.',
  },
  tags: ['ai-search', 'game-tree', 'best-first', 'sss-star'],
  complexity: { time: 'O(b^d)', space: 'O(b^d)' },
  references: [{ label: 'SSS* — Wikipedia', url: 'https://en.wikipedia.org/wiki/SSS*' }],
};
