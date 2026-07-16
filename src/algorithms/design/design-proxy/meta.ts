// 代理模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-proxy',
  categoryId: 'design',
  title: { zh: '代理模式', en: 'Proxy Pattern' },
  summary: {
    zh: '代理：用一个对象代表另一个对象，控制访问（延迟、权限、缓存）。',
    en: 'Proxy: one object stands in for another, controlling access (lazy, protection, cache).',
  },
  description: {
    zh: '代理模式（结构型）：\n\n- Subject 接口：request()。\n- RealSubject 真正实现。\n- Proxy 持有 RealSubject 引用，可在调用前后加控制。\n- 变体：虚拟代理（延迟创建）、保护代理（权限）、远程代理、缓存代理。\n\n本实现：虚拟代理 + 缓存代理，访问昂贵的图像加载。',
    en: 'Proxy Pattern (structural):\n\n- Subject interface: request().\n- RealSubject does the real work.\n- Proxy holds a RealSubject ref and can intercept before/after.\n- Variants: virtual (lazy), protection (auth), remote, caching.\n\nThis implementation: virtual + caching proxy wrapping an expensive image loader.',
  },
  tags: ['design', 'structural-pattern', 'access-control', 'lazy'],
  complexity: { time: 'O(1) cached / O(real) miss', space: 'O(cache)' },
};
