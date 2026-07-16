// 建造者模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-builder',
  categoryId: 'design',
  title: { zh: '建造者模式', en: 'Builder Pattern' },
  summary: {
    zh: '建造者：把复杂对象的构造与表示分离，分步设置可选参数。',
    en: 'Builder: separate construction of a complex object from its representation, setting optional params step by step.',
  },
  description: {
    zh: '建造者模式（创建型）：\n\n- Builder 暴露链式 setter 方法，最后 build() 产出 Product。\n- Director（可选）封装标准组装流程。\n- 解决“ telescoping constructor ”（构造参数膨胀）。\n- 适合很多可选字段：配置、查询、HTTP 请求、HTML。\n\n本实现：HTML 元素建造者，分步 setTag/attr/child/text 然后 build()。',
    en: 'Builder Pattern (creational):\n\n- Builder exposes fluent setters and a final build() returning the Product.\n- Director (optional) encapsulates a standard assembly flow.\n- Solves the telescoping-constructor problem.\n- Suits many optional fields: configs, queries, HTTP requests, HTML.\n\nThis implementation: an HTML element builder with step-by-step setTag/attr/child/text then build().',
  },
  tags: ['design', 'creational-pattern', 'construction', 'fluent'],
  complexity: { time: 'O(parts) build', space: 'O(parts)' },
};
