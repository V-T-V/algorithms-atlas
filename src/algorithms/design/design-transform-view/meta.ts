// 转换视图（Transform View）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-transform-view',
  categoryId: 'design',
  title: { zh: '转换视图', en: 'Transform View' },
  summary: { zh: '逐条转换模型为展示。', en: 'Transform each model row to display.' },
  description: {
    zh: '转换视图模式遍历数据，对每条记录应用转换函数生成展示输出，常用于把 DB 行转 HTML 表格行。',
    en: 'The Transform View pattern iterates data, applying a transform per record to produce display output (e.g. DB rows to HTML table rows).',
  },
  tags: ['design', 'pattern', 'transform-view', 'architectural'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
