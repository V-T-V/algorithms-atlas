// 桥接模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-bridge',
  categoryId: 'design',
  title: { zh: '桥接模式', en: 'Bridge Pattern' },
  summary: {
    zh: '桥接：把抽象与实现分离，使二者可独立变化（避免类爆炸）。',
    en: 'Bridge: decouple abstraction from implementation so both can vary independently (avoids class explosion).',
  },
  description: {
    zh: '桥接模式（结构型）：\n\n- Abstraction 持有 Implementor 引用，把具体操作委托。\n- Implementor 定义底层接口。\n- 抽象维度（如形状）和实现维度（如渲染器）独立扩展。\n- 避免每种组合都建一个子类（M×N → M+N）。\n\n本实现：形状（圆、矩形）× 渲染器（矢量、光栅），4 种组合无需 4 个类。',
    en: 'Bridge Pattern (structural):\n\n- Abstraction holds an Implementor ref, delegating concrete operations.\n- Implementor defines the low-level interface.\n- The abstraction dimension (e.g., shape) and the implementation dimension (e.g., renderer) vary independently.\n- Avoids creating a subclass per combination (M*N → M+N).\n\nThis implementation: shapes (circle, rectangle) x renderers (vector, raster) giving 4 combinations with only 4 classes.',
  },
  tags: ['design', 'structural-pattern', 'decoupling', 'dimensions'],
  complexity: { time: 'O(operation)', space: 'O(1)' },
};
