// 装饰器模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-decorator',
  categoryId: 'design',
  title: { zh: '装饰器模式', en: 'Decorator Pattern' },
  summary: {
    zh: '装饰器：动态给对象添加职责，比子类化更灵活。',
    en: 'Decorator: dynamically add responsibilities to an object, more flexibly than subclassing.',
  },
  description: {
    zh: '装饰器模式（结构型）：\n\n- Component 接口：operation()。\n- ConcreteComponent 基础实现。\n- Decorator 持有 Component 引用，调用时增强。\n- 可层层嵌套：A → B(A) → C(B(A))。\n- 经典应用：Java I/O 流、咖啡加料计价、UI 组件边框。\n\n本实现：咖啡 + 牛奶 + 糖 + 奶油 多层装饰计价。',
    en: 'Decorator Pattern (structural):\n\n- Component interface: operation().\n- ConcreteComponent base implementation.\n- Decorator holds a Component ref and enhances its behavior.\n- Can nest: A → B(A) → C(B(A)).\n- Classic uses: Java I/O streams, coffee add-ons pricing, UI widget borders.\n\nThis implementation: coffee + milk + sugar + cream layered decorators for pricing.',
  },
  tags: ['design', 'structural-pattern', 'wrapper', 'composition'],
  complexity: { time: 'O(decorator depth)', space: 'O(depth)' },
};
