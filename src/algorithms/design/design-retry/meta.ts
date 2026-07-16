// 重试（Retry）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-retry',
  categoryId: 'design',
  title: { zh: '重试', en: 'Retry' },
  summary: {
    zh: '重试：失败后按退避策略重复。',
    en: 'Retry: repeat on failure with a backoff strategy.',
  },
  description: {
    zh: '重试（Retry）模式在调用失败时按指数退避（exponential backoff）重复若干次，提高瞬时故障下的成功率。',
    en: 'Retry repeats a failing call with exponential backoff several times, improving success rate under transient failures.',
  },
  tags: ['design', 'retry', 'backoff', 'resilience'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
