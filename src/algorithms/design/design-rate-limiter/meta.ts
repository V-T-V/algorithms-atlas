// 限流器（Rate Limiter）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-rate-limiter',
  categoryId: 'design',
  title: { zh: '限流器', en: 'Rate Limiter' },
  summary: {
    zh: '限流器：令牌桶控制单位时间请求数。',
    en: 'Rate limiter: token bucket controls requests per unit time.',
  },
  description: {
    zh: '令牌桶限流（Token Bucket）：桶容量 cap，按 rate/秒匀速补充令牌；每次请求消耗 1 个，无令牌则拒绝。',
    en: 'Token Bucket rate limiting: bucket capacity cap, refilled at rate tokens/sec; each request consumes one, requests with no tokens are rejected.',
  },
  tags: ['design', 'rate-limiter', 'token-bucket', 'throttle'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
