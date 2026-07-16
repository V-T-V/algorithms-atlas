// Negascout / 主线变着搜索 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'negascout',
  categoryId: 'ai-search',
  title: { zh: 'Negascout / 主线变着搜索', en: 'Negascout / Principal Variation Search' },
  summary: {
    zh: '用零窗口搜索加速 alpha-beta：先探主线，其余用窄窗口快速剪枝。',
    en: 'Accelerates alpha-beta with null-window searches: probe PV first, then scout the rest with a narrow window.',
  },
  description: {
    zh: 'Negascout（又称 Principal Variation Search，PVS）与 alpha-beta 返回相同结果但通常更快。思路：假设第一个子节点在主线上（即最优），用完整窗口 [alpha,beta] 搜索它；其余子节点先用零窗口 [−β,−α−1] 探查，若失败（re-search）再用完整窗口重搜。在走法排序良好时，零窗口搜索大多能直接剪枝，显著减少节点数。本实现在通用数值博弈树上工作，节点带 utility 叶子值。',
    en: 'Negascout (a.k.a. Principal Variation Search) returns the same value as alpha-beta but is usually faster. Idea: assume the first child is on the principal variation and search it with the full [alpha,beta] window; probe the rest with a null window [-β,-α-1], and only re-search with the full window if the probe fails. With good move ordering most probes cut off immediately. This implementation works on a generic numeric game tree with utility leaves.',
  },
  tags: ['ai-search', 'game-tree', 'alpha-beta', 'pruning'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
  references: [
    {
      label: 'Principal Variation Search — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Principal_variation_search',
    },
  ],
};
