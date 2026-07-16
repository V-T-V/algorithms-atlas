// 集合覆盖 LP 舍入（Set Cover LP Rounding）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-set-cover-lp',
  categoryId: 'greedy',
  title: { zh: '集合覆盖 LP 舍入', en: 'Set Cover LP Rounding' },
  summary: {
    zh: '先解 LP 松弛再用贪心阈值舍入，得到 O(ln n) 近似。',
    en: 'Solve the LP relaxation then round by threshold for an O(ln n) approximation.',
  },
  description: {
    zh: '集合覆盖 LP：min Σx_S s.t. ∀e Σ_{S∋e} x_S≥1。分数解按 x_S 与 |S| 比值贪心取整。',
    en: 'Set cover LP: min Σx_S s.t. each element covered. Round fractional solution by cost-effectiveness greedy.',
  },
  tags: ['greedy', 'lp', 'approximation'],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
