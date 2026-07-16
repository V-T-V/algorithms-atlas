// 窗口搜索（Window Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-window-search',
  categoryId: 'ai-search',
  title: { zh: '窗口搜索', en: 'Window Search' },
  summary: {
    zh: '窄窗口 alpha-beta：失败时回退到全窗口，命中时大幅剪枝。',
    en: 'Narrow-window alpha-beta: fall back to full window on failure; prune hard on hit.',
  },
  description: {
    zh: '窗口搜索（Aspiration Search）以窄窗口 [guess−w, guess+w] 调用 alpha-beta；若 fail-high 或 fail-low 则用全窗口重搜。窗口命中时展开节点数显著减少。',
    en: 'Window (aspiration) search calls alpha-beta with a narrow window [guess−w, guess+w]; if it fails high or low, re-search with the full window. Hits prune many nodes.',
  },
  tags: ['ai-search', 'alpha-beta', 'window', 'aspiration'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
};
