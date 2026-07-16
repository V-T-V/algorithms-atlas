// 外观模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-facade',
  categoryId: 'design',
  title: { zh: '外观模式', en: 'Facade Pattern' },
  summary: {
    zh: '外观：为复杂子系统提供一个统一的高层接口，简化客户端调用。',
    en: 'Facade: provide a unified high-level interface to a complex subsystem, simplifying client calls.',
  },
  description: {
    zh: '外观模式（结构型）：\n\n- Facade 包装多个子系统类，暴露一个简单方法。\n- 客户端只与 Facade 交互，不必了解子系统。\n- 子系统本身不依赖 Facade，可独立使用。\n- 经典应用：编译器 facade、订单系统、智能家居总控。\n\n本实现：电脑开机 facade 统一调用 CPU/内存/硬盘。',
    en: 'Facade Pattern (structural):\n\n- Facade wraps multiple subsystem classes and exposes one simple method.\n- Clients only talk to Facade, unaware of subsystem internals.\n- Subsystems remain independent of Facade and usable on their own.\n- Classic uses: compiler facades, order systems, smart-home hubs.\n\nThis implementation: a computer boot facade coordinating CPU/Memory/Disk subsystems.',
  },
  tags: ['design', 'structural-pattern', 'simplification', 'subsystem'],
  complexity: { time: 'O(subsystem calls)', space: 'O(1)' },
};
