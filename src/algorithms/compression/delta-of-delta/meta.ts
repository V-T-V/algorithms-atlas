// Delta-of-Delta 编码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'delta-of-delta',
  categoryId: 'compression',
  title: { zh: 'Delta-of-Delta 编码', en: 'Delta-of-Delta Encoding' },
  summary: {
    zh: '对时间戳序列做二次差分，常量斜率段归零。',
    en: 'Second-order differencing of timestamp series; constant-slope runs collapse to zero.',
  },
  description: {
    zh: 'Delta-of-Delta（Gorilla 风格）对单调/缓变的时间戳序列做二阶差分：d = (t[i]-t[i-1]) - (t[i-1]-t[i-2])。稳定采集场景下大部分 d=0，可用很短的变长码编码，是时序数据库里压缩时间戳的核心技巧。',
    en: 'Delta-of-Delta (Gorilla-style) takes the second difference of a (often monotonic) timestamp series: d = (t[i]-t[i-1]) - (t[i-1]-t[i-2]). For steadily-sampled data most d are 0, so a very short variable-length code suffices — the core trick for compressing timestamps in time-series databases.',
  },
  tags: ['compression', 'delta', 'time-series'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
