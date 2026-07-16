// 原型模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-prototype',
  categoryId: 'design',
  title: { zh: '原型模式', en: 'Prototype Pattern' },
  summary: {
    zh: '原型：通过克隆现有实例创建新对象，避免重复初始化开销。',
    en: 'Prototype: create new objects by cloning an existing instance, avoiding repeated initialization cost.',
  },
  description: {
    zh: '原型模式（创建型）：\n\n- Prototype 接口：clone()。\n- 子类实现深/浅克隆。\n- 客户端拿一个原型实例，复制得到新对象。\n- 适合：构造代价大（已加载的配置/缓存）、未知具体类、避免子类化。\n\n本实现：怪物原型（位置、血量），支持深克隆与 registry 注册。',
    en: 'Prototype Pattern (creational):\n\n- Prototype interface: clone().\n- Subclasses implement deep/shallow clone.\n- Clients clone a prototype instance to get new objects.\n- Suits: expensive construction (loaded configs/caches), unknown concrete classes, avoiding subclassing.\n\nThis implementation: monster prototypes (position, hp) with deep clone and a registry.',
  },
  tags: ['design', 'creational-pattern', 'clone', 'registry'],
  complexity: { time: 'O(state size) clone', space: 'O(prototypes)' },
};
