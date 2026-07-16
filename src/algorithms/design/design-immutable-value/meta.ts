// 不可变值对象（Immutable Value Object）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-immutable-value',
  categoryId: 'design',
  title: { zh: '不可变值对象', en: 'Immutable Value Object' },
  summary: { zh: '创建后状态永不改变。', en: 'State never changes after creation.' },
  description: {
    zh: '不可变值对象一旦构造所有字段只读，任何修改返回新实例，天然线程安全、易推理，是函数式编程核心(FP)、Java record。',
    en: 'An Immutable Value Object has only read-only fields after construction; any change returns a new instance. Thread-safe and easy to reason about; core to FP and Java records.',
  },
  tags: ['design', 'pattern', 'immutable', 'creational'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
