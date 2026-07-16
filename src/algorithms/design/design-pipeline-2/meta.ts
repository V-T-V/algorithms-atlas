// 管道模式 v2（Pipeline Pattern v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-pipeline-2',
  categoryId: 'design',
  title: { zh: '管道模式 v2', en: 'Pipeline Pattern v2' },
  summary: {
    zh: '管道：把处理拆成一串 stage，数据依次流过。',
    en: 'Pipeline: split processing into a chain of stages; data flows through.',
  },
  description: {
    zh: '管道（Pipeline）把复杂处理拆成多个独立 stage（函数），数据依次流过每个 stage，每个 stage 接收上一步输出。便于组合、测试与重排。',
    en: 'Pipeline splits complex processing into independent stage functions; data flows through each stage receiving the previous output. Easy to compose, test, and reorder.',
  },
  tags: ['design', 'pipeline', 'functional', 'chain'],
  complexity: { time: 'O(n·k)', space: 'O(1)' },
};
