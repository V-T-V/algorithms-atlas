// 单态模式（Monostate）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-monostate',
  categoryId: 'design',
  title: { zh: '单态模式', en: 'Monostate' },
  summary: { zh: '所有实例共享同一状态。', en: 'All instances share the same state.' },
  description: {
    zh: '单态模式通过静态字段让所有实例共享同一状态，调用方感觉是普通对象但行为等同单例，比单例更易测试。',
    en: 'Monostate shares state via static fields so all instances behave like one singleton while looking like normal objects; easier to test than Singleton.',
  },
  tags: ['design', 'pattern', 'monostate', 'creational'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
