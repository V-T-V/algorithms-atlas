// 访问者模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-visitor',
  categoryId: 'design',
  title: { zh: '访问者模式', en: 'Visitor Pattern' },
  summary: {
    zh: '访问者：把对一组异构对象的操作外置，便于新增操作而不改类。',
    en: 'Visitor: externalize operations over heterogeneous objects, making it easy to add operations without changing classes.',
  },
  description: {
    zh: '访问者模式（行为型）：\n\n- Element 接口：accept(visitor)。\n- Visitor 接口：visitConcreteA / visitConcreteB ...。\n- Element 在 accept 里 callback visitor.visitXxx(this)，实现双分派。\n- 适合：编译器 AST、文档导出多种格式、报表统计。\n\n本实现：几何形状（圆、矩形）+ 面积/周长两个访问者。',
    en: 'Visitor Pattern (behavioral):\n\n- Element interface: accept(visitor).\n- Visitor interface: visitConcreteA / visitConcreteB ...\n- Element double-dispatches by calling visitor.visitXxx(this) inside accept.\n- Suited for: compiler ASTs, document export to multiple formats, report statistics.\n\nThis implementation: shapes (circle, rectangle) + area/perimeter visitors.',
  },
  tags: ['design', 'behavioral-pattern', 'double-dispatch', 'ast'],
  complexity: { time: 'O(elements) per visit', space: 'O(1)' },
};
