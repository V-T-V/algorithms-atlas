// 抽象工厂模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-abstract-factory',
  categoryId: 'design',
  title: { zh: '抽象工厂模式', en: 'Abstract Factory Pattern' },
  summary: {
    zh: '抽象工厂：创建一系列相关对象（产品族）而无需指定具体类。',
    en: 'Abstract Factory: create families of related objects without specifying concrete classes.',
  },
  description: {
    zh: '抽象工厂模式（创建型）：\n\n- AbstractFactory 接口：createA() / createB()。\n- ConcreteFactory 实现一整套相关产品（如“现代风格”家具厂）。\n- 客户端只与抽象接口交互，产品族可整体替换。\n- 与工厂方法区别：工厂方法造单个产品，抽象工厂造一族。\n\n本实现：UI 主题工厂，dark/light 两族，各产 button + input。',
    en: 'Abstract Factory Pattern (creational):\n\n- AbstractFactory interface: createA() / createB().\n- ConcreteFactory implements a whole family of related products (e.g., Modern furniture factory).\n- Clients only talk to the abstract interface; the entire family can be swapped.\n- Difference from Factory Method: FM produces one product, AF produces a family.\n\nThis implementation: a UI theme factory with dark/light families, each producing a button + input.',
  },
  tags: ['design', 'creational-pattern', 'family', 'theme'],
  complexity: { time: 'O(1) per create', space: 'O(products)' },
};
