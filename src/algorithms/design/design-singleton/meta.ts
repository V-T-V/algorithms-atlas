// 单例模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-singleton',
  categoryId: 'design',
  title: { zh: '单例模式', en: 'Singleton Pattern' },
  summary: {
    zh: '单例：保证一个类只有一个实例，并提供全局访问点。',
    en: 'Singleton: ensure a class has exactly one instance and provide a global access point.',
  },
  description: {
    zh: '单例模式（创建型）：\n\n- 构造函数私有，外部无法 new。\n- 静态方法 getInstance() 返回唯一实例（懒加载）。\n- 多线程下需双检锁；TS 单线程下直接判断即可。\n- 经典应用：日志器、配置、连接池、缓存、设备驱动。\n\n本实现：线程安全的懒加载配置单例 + 计数访问次数。',
    en: 'Singleton Pattern (creational):\n\n- Private constructor prevents external new.\n- Static getInstance() returns the unique instance (lazy).\n- Multi-threaded code needs double-checked locking; TS is single-threaded so a plain check suffices.\n- Classic uses: loggers, configs, connection pools, caches, device drivers.\n\nThis implementation: a lazy config singleton with an access counter.',
  },
  tags: ['design', 'creational-pattern', 'single-instance', 'global'],
  complexity: { time: 'O(1) getInstance', space: 'O(1)' },
};
