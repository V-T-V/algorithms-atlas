// 策略模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-strategy',
  categoryId: 'design',
  title: { zh: '策略模式', en: 'Strategy Pattern' },
  summary: {
    zh: '策略：把一组算法封装成可互换的策略对象，运行时切换。',
    en: 'Strategy: encapsulate a family of algorithms as swappable strategy objects, switchable at runtime.',
  },
  description: {
    zh: '策略模式（行为型）：\n\n- Strategy 接口：execute(data)。\n- ConcreteStrategy 多个具体算法实现。\n- Context 持有当前 Strategy，可替换。\n- 替代大型 if/else 选择算法，便于新增。\n\n本实现：排序策略（冒泡、选择、插入）运行时切换。',
    en: 'Strategy Pattern (behavioral):\n\n- Strategy interface: execute(data).\n- ConcreteStrategy implementations of each algorithm.\n- Context holds the current Strategy, swappable.\n- Replaces large if/else algorithm-selection branches; easy to add new ones.\n\nThis implementation: sorting strategies (bubble, selection, insertion) switchable at runtime.',
  },
  tags: ['design', 'behavioral-pattern', 'algorithm-swap', 'policy'],
  complexity: { time: 'O(algorithm)', space: 'O(n)' },
};
