// 流式构建器（Fluent Builder）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-fluent-builder',
  categoryId: 'design',
  title: { zh: '流式构建器', en: 'Fluent Builder' },
  summary: {
    zh: '流式构建器：链式方法调用逐步设置属性并 build。',
    en: 'Fluent builder: chainable methods to set properties then build.',
  },
  description: {
    zh: '流式构建器（Fluent Builder）每个 setter 返回 this，支持链式调用，最后调用 build() 生成不可变对象。常见于 SQL/HTTP 客户端构建。',
    en: 'Fluent Builder: each setter returns this for chaining, with a final build() producing an immutable object; common in SQL/HTTP client construction.',
  },
  tags: ['design', 'builder', 'fluent', 'creational'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
