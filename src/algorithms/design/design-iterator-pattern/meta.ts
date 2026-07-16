// 迭代器模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-iterator-pattern',
  categoryId: 'design',
  title: { zh: '迭代器模式', en: 'Iterator Pattern' },
  summary: {
    zh: '迭代器：提供统一方式顺序遍历聚合，不暴露其内部结构。',
    en: 'Iterator: provide a uniform way to traverse aggregates sequentially without exposing internals.',
  },
  description: {
    zh: '迭代器模式（行为型）：\n\n- Iterator 接口：hasNext() / next()。\n- Aggregate 提供 createIterator()。\n- 客户端无需知道底层是数组、链表还是树。\n- 是几乎所有现代语言 for-of 的基础。\n\n本实现：自定义链表 + 正向/反向两个迭代器。',
    en: 'Iterator Pattern (behavioral):\n\n- Iterator interface: hasNext() / next().\n- Aggregate exposes createIterator().\n- Clients need not know whether the backing store is array, list, or tree.\n- Underpins for-of in nearly all modern languages.\n\nThis implementation: a custom linked list with forward and reverse iterators.',
  },
  tags: ['design', 'behavioral-pattern', 'traversal', 'aggregate'],
  complexity: { time: 'O(1) next/hasNext', space: 'O(1)' },
};
