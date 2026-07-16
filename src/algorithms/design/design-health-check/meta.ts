// 健康检查（Health Check）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-health-check',
  categoryId: 'design',
  title: { zh: '健康检查', en: 'Health Check' },
  summary: {
    zh: '健康检查：周期性探测依赖，聚合 UP/DOWN。',
    en: 'Health check: periodically probe dependencies and aggregate UP/DOWN.',
  },
  description: {
    zh: '健康检查（Health Check）注册多个探针（数据库、缓存、下游服务），check() 并发探测并聚合为整体状态 UP/DEGRADED/DOWN。',
    en: 'Health Check registers probes (database, cache, downstream services); check() probes concurrently and aggregates to UP/DEGRADED/DOWN.',
  },
  tags: ['design', 'health-check', 'monitoring', 'observability'],
  complexity: { time: 'O(p)', space: 'O(p)' },
};
