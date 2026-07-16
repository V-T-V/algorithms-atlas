// 熔断器（Circuit Breaker）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-circuit-breaker',
  categoryId: 'design',
  title: { zh: '熔断器', en: 'Circuit Breaker' },
  summary: {
    zh: '熔断器：失败达阈值后短路，半开试探恢复。',
    en: 'Circuit breaker: short-circuit after threshold failures; half-open probes recovery.',
  },
  description: {
    zh: '熔断器（Circuit Breaker）三种状态：CLOSED（正常）→ 失败达阈值 → OPEN（直接拒绝）→ 超时后 HALF_OPEN（试探少量请求）→ 成功回 CLOSED。',
    en: 'Circuit Breaker has three states: CLOSED (normal) → failures reach threshold → OPEN (fast-fail) → after timeout HALF_OPEN (probe) → success returns to CLOSED.',
  },
  tags: ['design', 'circuit-breaker', 'resilience', 'fault-tolerance'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
