// 舱壁隔离（Bulkhead）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-bulkhead',
  categoryId: 'design',
  title: { zh: '舱壁隔离', en: 'Bulkhead' },
  summary: {
    zh: '舱壁：限制并发资源池，故障不扩散。',
    en: 'Bulkhead: limit concurrent resource pools so failures do not spread.',
  },
  description: {
    zh: '舱壁（Bulkhead）把资源（线程/连接）分到隔离池，单个池打满不影响其他池，避免雪崩。',
    en: 'Bulkhead partitions resources (threads/connections) into isolated pools; one pool saturating does not affect others, preventing cascading failure.',
  },
  tags: ['design', 'bulkhead', 'resilience', 'isolation'],
  complexity: { time: 'O(1)', space: 'O(p)' },
};
