// Saga（Saga）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-saga',
  categoryId: 'design',
  title: { zh: 'Saga', en: 'Saga' },
  summary: {
    zh: 'Saga：长事务拆成一系列带补偿的步骤。',
    en: 'Saga: split a long transaction into steps with compensations.',
  },
  description: {
    zh: 'Saga 模式把分布式长事务拆成多个本地事务步骤，每步配一个补偿动作；任一步失败时反向执行已完成步骤的补偿。',
    en: 'Saga splits a distributed long transaction into local transaction steps, each with a compensating action; on any failure, completed steps are rolled back in reverse.',
  },
  tags: ['design', 'saga', 'distributed-transaction', 'compensation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
