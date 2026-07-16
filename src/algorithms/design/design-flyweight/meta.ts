// 享元模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-flyweight',
  categoryId: 'design',
  title: { zh: '享元模式', en: 'Flyweight Pattern' },
  summary: {
    zh: '享元：共享细粒度对象以减少内存，把内在状态与外在状态分离。',
    en: 'Flyweight: share fine-grained objects to save memory, separating intrinsic from extrinsic state.',
  },
  description: {
    zh: '享元模式（结构型）：\n\n- Flyweight：内部状态（intrinsic）共享，如字符的形状数据。\n- 外部状态（extrinsic）由客户端传入，如位置、颜色。\n- FlyweightFactory 维护已创建实例，避免重复创建。\n- 经典应用：游戏粒子、文本编辑器字符、Java Integer 缓存。\n\n本实现：森林里种树，树种类（名称+颜色+纹理）共享，位置外在。',
    en: 'Flyweight Pattern (structural):\n\n- Flyweight: shared intrinsic state (e.g., character glyph data).\n- Extrinsic state (position, color) is passed in by clients.\n- FlyweightFactory caches created instances to avoid duplication.\n- Classic uses: game particles, text editor glyphs, Java Integer cache.\n\nThis implementation: a forest where tree types (name+color+texture) are shared; positions are extrinsic.',
  },
  tags: ['design', 'structural-pattern', 'sharing', 'memory'],
  complexity: { time: 'O(1) per get', space: 'O(unique flyweights)' },
};
