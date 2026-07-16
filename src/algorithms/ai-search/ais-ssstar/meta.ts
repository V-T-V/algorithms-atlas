// SSS* 算法 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-ssstar',
  categoryId: 'ai-search',
  title: { zh: 'SSS* 算法 (状态集搜索)', en: 'SSS* Algorithm' },
  summary: {
    zh: 'SSS*：用最佳优先遍历博弈树叶子的状态集，理论上比 alpha-beta 展开更少节点。',
    en: 'SSS*: best-first traversal of a state set over game-tree leaves, theoretically expanding no more nodes than alpha-beta.',
  },
  description: {
    zh: 'SSS*（Stockman, 1979）是零和博弈树搜索算法，用「状态集」(open list) 以最佳优先方式遍历叶子。每个状态记录一个节点及其上界估计 h。算法反复取出 h 最小的状态：若是叶子则回传确定值；若是 MAX 节点则展开其子；若是 MIN 节点且所有兄弟已处理则回传。在理论模型下 SSS* 展开的叶子数不多于 alpha-beta。实践中因内存/开销常被等价的 ID+alpha-beta 取代。本实现演示 SSS* 在数值博弈树上的运行。',
    en: 'SSS* (Stockman, 1979) is a zero-sum game-tree search algorithm that best-first traverses leaves via a state set (open list). Each state records a node and an upper-bound estimate h. The algorithm repeatedly pops the state with smallest h: a leaf returns a definite value; a MAX node expands its children; a MIN node returns once all siblings are processed. Theoretically SSS* expands no more leaves than alpha-beta. In practice it is often replaced by the equivalent ID+alpha-beta due to memory/overhead. This implementation demonstrates SSS* on numeric game trees.',
  },
  tags: ['ai-search', 'sss', 'best-first', 'game-search', 'two-player'],
  complexity: { time: 'O(b^d)', space: 'O(b^d)' },
};
