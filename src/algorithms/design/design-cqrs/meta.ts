// CQRS（CQRS）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-cqrs',
  categoryId: 'design',
  title: { zh: 'CQRS', en: 'CQRS' },
  summary: {
    zh: 'CQRS：命令（写）与查询（读）模型分离。',
    en: 'CQRS: separate Command (write) from Query (read) models.',
  },
  description: {
    zh: 'CQRS（Command Query Responsibility Segregation）把写入侧（Command）与读取侧（Query）拆成独立模型，可分别优化（写用规范模型，读用反范式视图）。',
    en: 'CQRS separates the write side (Commands) from the read side (Queries) into independent models that can be optimized separately (normalized writes, denormalized read views).',
  },
  tags: ['design', 'cqrs', 'separation', 'architecture'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
