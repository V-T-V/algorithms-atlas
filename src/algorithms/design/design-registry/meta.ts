// 注册表（Registry）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-registry',
  categoryId: 'design',
  title: { zh: '注册表', en: 'Registry' },
  summary: {
    zh: '注册表：全局 map 注册/查找服务实现。',
    en: 'Registry: a global map to register and look up service implementations.',
  },
  description: {
    zh: '注册表（Registry）维护一个 name→impl 的映射，插件先 register(name, impl)，使用方 lookup(name) 解耦具体实现。',
    en: 'Registry maintains a name→impl map; plugins register(name, impl) and consumers lookup(name), decoupling the concrete implementation.',
  },
  tags: ['design', 'registry', 'lookup', 'decoupling'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
