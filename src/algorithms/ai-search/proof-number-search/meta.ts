// 证明数搜索 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'proof-number-search',
  categoryId: 'ai-search',
  title: { zh: '证明数搜索 (PN-Search)', en: 'Proof-Number Search' },
  summary: {
    zh: '在 AND-OR 树上求证/反证，用证明数与反证数指导最关键节点展开。',
    en: 'Prove/disprove on an AND-OR tree, guided by proof and disproof numbers of the most critical node.',
  },
  description: {
    zh: '证明数搜索（Proof-Number Search, PN-Search）由 Allis 提出，用于求解（胜负已定）而非估值。它在一棵 AND-OR 树上工作：OR 节点（轮到我）只需一个子节点被证明即被证明；AND 节点（轮到对手）需所有子节点被证明才被证明。每个节点维护 (proofNumber, disproofNumber)：proofNumber = 证明该节点所需的最少额外叶节点数；disproofNumber = 反证所需的最少叶节点数。算法反复选「最易证明/反证的」叶节点展开，直到根的 proof 或 disproof 之一为 0。本实现提供完整的 pn-search 过程，并允许从已部分展开的树开始。',
    en: 'Proof-Number Search (PN-Search), proposed by Allis, solves (decides win/loss) rather than estimates. It works on an AND-Or tree: an OR node (my turn) is proven if any child is; an AND node (opponent\'s turn) is proven only if all children are. Each node keeps (proofNumber, disproofNumber): the minimum number of additional leaves needed to prove / disprove it. The algorithm repeatedly expands the "easiest to prove/disprove" leaf until the root\'s proof or disproof number becomes 0. This implementation provides the full PN process and can start from a partially expanded tree.',
  },
  tags: ['ai-search', 'and-or-tree', 'solving', 'proof-number'],
  complexity: { time: 'O(展开节点数)', space: 'O(树节点数)' },
  references: [
    {
      label: 'Proof-number search — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Proof-number_search',
    },
  ],
};
