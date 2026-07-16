// State Compression (Profile DP) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'state-compression',
  categoryId: 'dp',
  title: { zh: '状压进阶（轮廓线 DP）', en: 'State Compression (Profile DP)' },
  summary: {
    zh: '状压进阶（轮廓线 DP）属于dp类别。',
    en: 'State Compression (Profile DP) is a dp algorithm.',
  },
  description: {
    zh: '状压进阶（轮廓线 DP）（State Compression (Profile DP)）属于dp类别的算法。',
    en: 'State Compression (Profile DP) is an algorithm in the dp category.',
  },
  tags: ["dp","compression"],
  complexity: { time: 'O(n·m·2^m)', space: 'O(2^m)' },
};
