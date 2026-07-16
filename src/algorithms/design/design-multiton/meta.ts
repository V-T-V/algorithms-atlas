// 多例模式（Multiton）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-multiton',
  categoryId: 'design',
  title: { zh: '多例模式', en: 'Multiton' },
  summary: { zh: '按键缓存有限个单例。', en: 'Caches a bounded set of singletons by key.' },
  description: {
    zh: '多例模式维护一个键到唯一实例的映射，保证同一键返回同一实例，是单例的推广，常用于连接池、缓存命名空间。',
    en: 'The Multiton pattern maps keys to unique instances, guaranteeing the same instance per key; generalizes Singleton. Used in pools and cache namespaces.',
  },
  tags: ['design', 'pattern', 'multiton', 'creational'],
  complexity: { time: 'O(1)', space: 'O(k)' },
};
