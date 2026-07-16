// 和声搜索（Harmony Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-harmony-search',
  categoryId: 'ai-search',
  title: { zh: '和声搜索', en: 'Harmony Search' },
  summary: {
    zh: '记忆库取值 + 音调微调 + 随机选择，新和声优于最差即替换。',
    en: 'Memory-take + pitch-adjust + random choice; replace worst if new harmony is better.',
  },
  description: {
    zh: '和声搜索（Geem 2001）：每个变量以概率 HMCR 从记忆库取值，以概率 PAR 微调（±bw），否则随机；新和声优于最差者即替换。本实现在 Sphere 上演示。',
    en: 'Harmony search (Geem 2001): each variable is taken from memory with prob HMCR, pitch-adjusted (±bw) with prob PAR, otherwise randomly chosen; better new harmony replaces the worst. Demo on Sphere.',
  },
  tags: ['ai-search', 'metaheuristic', 'optimization', 'harmony'],
  complexity: { time: 'O(iter × n)', space: 'O(hms × n)' },
};
