// 流式接口（Fluent Interface）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-fluent-interface',
  categoryId: 'design',
  title: { zh: '流式接口', en: 'Fluent Interface' },
  summary: { zh: '方法链式返回 this。', en: 'Methods return this for chaining.' },
  description: {
    zh: '流式接口让每个修改方法返回 this，使调用可链式写成一行的查询/构建语句，常见于 jQuery、Stream、QueryBuilder。',
    en: 'A fluent interface has each mutator return this, enabling one-line chained calls; seen in jQuery, Stream, QueryBuilder.',
  },
  tags: ['design', 'pattern', 'fluent', 'creational'],
  complexity: { time: 'O(1) per op', space: 'O(1)' },
};
