// SAP Max Flow · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sap',
  categoryId: 'graph',
  title: { zh: 'SAP最大流', en: 'SAP Max Flow' },
  summary: {
    zh: 'SAP最大流属于graph类别。',
    en: 'SAP Max Flow is a graph algorithm.',
  },
  description: {
    zh: 'SAP最大流（SAP Max Flow）属于graph类别的算法。',
    en: 'SAP Max Flow is an algorithm in the graph category.',
  },
  tags: ["graph"],
  complexity: { time: 'O(V² E)', space: 'O(V + E)' },
};
