// 配置管理器（Config Manager）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-config-manager',
  categoryId: 'design',
  title: { zh: '配置管理器', en: 'Config Manager' },
  summary: {
    zh: '配置管理器：键值配置 + 热更新监听。',
    en: 'Config manager: key-value config with hot-reload listeners.',
  },
  description: {
    zh: '配置管理器（Config Manager）维护一份键值配置，支持 get/set、默认值、变更监听（onChange），实现热更新。',
    en: 'Config Manager maintains key-value config supporting get/set, defaults, and change listeners (onChange) for hot reload.',
  },
  tags: ['design', 'config', 'hot-reload', 'observer'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
