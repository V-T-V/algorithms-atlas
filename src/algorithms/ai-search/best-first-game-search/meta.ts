// 博弈最佳优先搜索（Best-First Game Search, BStar）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'best-first-game-search',
  categoryId: 'ai-search',
  title: { zh: '博弈最佳优先搜索', en: 'Best-First Game Search (B*)' },
  summary: {
    zh: 'Berliner 的 B*：用乐观/悲观双估值，按最佳优先扩展博弈树直到根的决策证明成立。',
    en: "Berliner's B*: use optimistic/pessimistic bound pairs, best-first expand until a root decision is proven.",
  },
  description: {
    zh: 'B*（Berliner, 1979）是一种「最佳优先」的博弈搜索算法，区别于 α-β 的深度优先：\n\n每个节点维护两个估值：**乐观值** `opt`（该节点可能达到的上界）与 **悲观值** `pess`（下界）。叶子节点的这两个值由静态评估给出；内部节点按 max/min 聚合：\n- MAX 节点：opt = max(child.opt)，pess = max(child.pess)\n- MIN 节点：opt = min(child.opt)，pess = min(child.pess)\n\n算法每次选择「最有希望确立最优证明」的叶子（即从根开始递归选 opt-pess 框架下最佳的子节点）展开，直到根节点存在某个子节点的 pess ≥ 其他子节点的 opt——此时该子节点被证明为最优。\n\n优点：可提前停止；缺点：内存占用大、需要好的双估值。本实现在数值博弈树上工作，叶子用 utility ± 容差作为 opt/pess。',
    en: 'B* (Berliner, 1979) is a "best-first" game search, contrasting with alpha-beta\'s depth-first:\n\nEach node holds two bounds: an **optimistic** value `opt` (upper bound the node can reach) and a **pessimistic** value `pess` (lower bound). Leaves get these from a static eval; internal nodes aggregate by max/min:\n- MAX node: opt = max(child.opt), pess = max(child.pess)\n- MIN node: opt = min(child.opt), pess = min(child.pess)\n\nAt each step we expand the leaf most likely to establish the proof at the root (recursively descend to the best child under the opt-pess framework), until some root child has pess >= opt of all the others — proving it optimal.\n\nPros: can stop early. Cons: high memory, needs good dual bounds. This implementation works on a numeric game tree, using utility ± tolerance as opt/pess.',
  },
  tags: ['ai-search', 'game-tree', 'best-first', 'b-star'],
  complexity: { time: 'O(b^d)', space: 'O(b^d)' },
  references: [{ label: 'B* — Wikipedia', url: 'https://en.wikipedia.org/wiki/B*' }],
};
