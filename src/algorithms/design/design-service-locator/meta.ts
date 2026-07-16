// 服务定位器（Service Locator）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-service-locator',
  categoryId: 'design',
  title: { zh: '服务定位器', en: 'Service Locator' },
  summary: {
    zh: '服务定位器：按需按类型获取单例服务。',
    en: 'Service locator: get singleton services on demand by key/type.',
  },
  description: {
    zh: '服务定位器（Service Locator）封装一个全局容器，提供 getService(key) 延迟获取依赖；与依赖注入相比更动态但有隐藏耦合。',
    en: 'Service Locator wraps a global container; getService(key) lazily fetches dependencies. More dynamic than DI but with hidden coupling.',
  },
  tags: ['design', 'service-locator', 'container', 'di'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
