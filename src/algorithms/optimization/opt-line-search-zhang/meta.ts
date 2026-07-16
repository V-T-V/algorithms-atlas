// Zhang-Hager 线搜索（Zhang-Hager Line Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-line-search-zhang',
  categoryId: 'optimization',
  title: { zh: 'Zhang-Hager 线搜索', en: 'Zhang-Hager Line Search' },
  summary: {
    zh: '非单调线搜索：允许目标偶尔上升，避免窄谷震荡。',
    en: 'Non-monotone line search allowing occasional objective increases; avoids narrow-valley oscillation.',
  },
  description: {
    zh: 'Zhang-Hager：维护参考值 c≤max f，接受满足 f≤c+α·步长的点，平滑非单调。',
    en: 'Zhang-Hager: reference c<=max f; accept point with f<=c+alpha*step; smooth non-monotone.',
  },
  tags: ['optimization', 'line-search', 'non-monotone'],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
