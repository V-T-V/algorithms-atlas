// 适配器模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-adapter',
  categoryId: 'design',
  title: { zh: '适配器模式', en: 'Adapter Pattern' },
  summary: {
    zh: '适配器：把不兼容接口的类转成客户端期望的接口。',
    en: 'Adapter: convert a class with an incompatible interface into one clients expect.',
  },
  description: {
    zh: '适配器模式（结构型）：\n\n- Target 接口：客户端期望的方法。\n- Adaptee 已有类，接口不兼容。\n- Adapter 实现 Target，内部持有 Adaptee，做参数/返回值转换。\n- 经典应用：第三方库包装、新旧 API 共存、电压转换器。\n\n本实现：把旧版日志器（LogMsg）适配成新版（log(level, message)）。',
    en: 'Adapter Pattern (structural):\n\n- Target interface: the method shape clients expect.\n- Adaptee: an existing class whose interface is incompatible.\n- Adapter implements Target, holds an Adaptee, and converts parameters/return values.\n- Classic uses: third-party library wrappers, legacy/new API coexistence, electrical adapters.\n\nThis implementation: adapting a legacy logger (LogMsg) to the new log(level, message) interface.',
  },
  tags: ['design', 'structural-pattern', 'wrapper', 'compatibility'],
  complexity: { time: 'O(1) per call', space: 'O(1)' },
};
