// 渴望窗口 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'aspiration-window',
  categoryId: 'ai-search',
  title: { zh: '渴望窗口', en: 'Aspiration Window' },
  summary: {
    zh: '用上一轮最佳值 ± 窗口做窄窗口搜索，失败则扩大，减少节点数。',
    en: 'Search a narrow window around the previous best value; widen on failure to reduce nodes.',
  },
  description: {
    zh: '渴望窗口（Aspiration Window）是 alpha-beta 的加速技巧。通常 alpha-beta 用全宽窗口 [−∞, +∞] 搜索。若已有上一轮（如迭代加深的上一深度）的最佳值 v，可改用窄窗口 [v−w, v+w]：因窗口窄，剪枝更频繁，搜索更快。若真实值落在窗口内（fail-low 或 fail-high 都不发生）即成功；若 fail-high（值 ≥ β）或 fail-low（值 ≤ α），则用更宽/全宽窗口重搜。结合迭代加深时，上一深度的最佳值通常很接近当前深度的值，成功率很高。本实现在数值博弈树上工作，结果与全宽搜索一致。',
    en: 'Aspiration Window is an alpha-beta acceleration. Normally alpha-beta uses a full [−∞, +∞] window. If a previous best value v is known (e.g., from the previous iterative-deepening level), use a narrow window [v−w, v+w]: the narrow window triggers more cutoffs and is faster. If the true value falls inside (no fail-low or fail-high), it succeeds; otherwise widen to a full window and re-search. With iterative deepening the previous value is usually close, so the hit rate is high. This implementation works on a numeric game tree and matches a full-window search.',
  },
  tags: ['ai-search', 'game-tree', 'alpha-beta', 'pruning'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
  references: [
    {
      label: 'Aspiration window — Chessprogramming Wiki',
      url: 'https://www.chessprogramming.org/Aspiration_Windows',
    },
  ],
};
