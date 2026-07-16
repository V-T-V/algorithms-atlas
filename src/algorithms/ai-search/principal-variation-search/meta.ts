// 主变搜索 PVS（Principal Variation Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'principal-variation-search',
  categoryId: 'ai-search',
  title: { zh: '主变搜索 PVS', en: 'Principal Variation Search' },
  summary: {
    zh: '假设第一个走法在主线上用全窗搜索，其余用零窗口探测，失败才重搜。',
    en: 'Assume the first move is on the PV with full window; scout the rest with a null window, re-search only on failure.',
  },
  description: {
    zh: '主变搜索（PVS）是与 α-β 等价但通常更快的算法，与 Negascout 同源但以「主变」视角表述更清晰：\n\n1. 对节点的第一个子节点（假设在主线上）用完整窗口 `[α, β]` 递归搜索。\n2. 对其余子节点用零窗口 `[α, α+1]` 探测；零窗口搜索要么立即剪枝、要么返回一个超过 α 的值。\n3. 若探测值 `α < v < β`，说明零窗口结果不可信，需要用完整窗口 `[α, β]` 重搜。\n\n走法排序良好时，绝大多数零窗口探测会直接剪枝，节点数显著减少。本实现在数值博弈树上工作，根值与纯 α-β 严格一致。',
    en: 'Principal Variation Search is equivalent to alpha-beta but usually faster; it shares roots with Negascout but is phrased more clearly from the "principal variation" perspective:\n\n1. Search the first child (assumed on the PV) with the full window `[alpha, beta]`.\n2. Probe the remaining children with a null window `[alpha, alpha+1]`; a null-window search either cuts off immediately or returns a value exceeding alpha.\n3. If `alpha < v < beta`, the null-window result is untrustworthy and we re-search with the full window `[alpha, beta]`.\n\nWith good move ordering, most probes cut off immediately, dramatically reducing node count. This implementation works on a numeric game tree and its root value matches plain alpha-beta exactly.',
  },
  tags: ['ai-search', 'game-tree', 'alpha-beta', 'pruning', 'principal-variation'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
  references: [
    {
      label: 'Principal Variation Search — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Principal_variation_search',
    },
  ],
};
