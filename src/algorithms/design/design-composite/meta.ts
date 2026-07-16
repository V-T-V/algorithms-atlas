// 组合模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-composite',
  categoryId: 'design',
  title: { zh: '组合模式', en: 'Composite Pattern' },
  summary: {
    zh: '组合：把对象组合成树形结构以表示“部分-整体”层次，统一叶子和容器。',
    en: 'Composite: compose objects into tree structures to represent part-whole hierarchies, unifying leaves and containers.',
  },
  description: {
    zh: '组合模式（结构型）：\n\n- Component 接口：operation()。\n- Leaf 叶子节点。\n- Composite 容器节点，持有子 Component 列表，递归调用。\n- 客户端对单个叶子和组合体一视同仁。\n- 经典应用：文件系统、UI 控件树、组织架构、AST。\n\n本实现：文件系统（File 叶子 + Directory 容器），统一 size()。',
    en: 'Composite Pattern (structural):\n\n- Component interface: operation().\n- Leaf node.\n- Composite container node holding child Components, recursing on operation.\n- Clients treat individual leaves and composites uniformly.\n- Classic uses: file systems, UI widget trees, org charts, ASTs.\n\nThis implementation: a file system (File leaves + Directory containers) with a uniform size().',
  },
  tags: ['design', 'structural-pattern', 'tree', 'part-whole'],
  complexity: { time: 'O(nodes) operation', space: 'O(depth)' },
};
