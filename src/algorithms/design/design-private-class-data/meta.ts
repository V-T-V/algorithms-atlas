// 私有类数据模式（Private Class Data）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-private-class-data',
  categoryId: 'design',
  title: { zh: '私有类数据模式', en: 'Private Class Data' },
  summary: {
    zh: '把可变状态封装到独立对象。',
    en: 'Encapsulate mutable state in a separate object.',
  },
  description: {
    zh: '私有类数据模式把类的内部状态抽到独立数据对象，主类只持只读引用，防止方法意外修改、便于加锁保护。',
    en: 'The Private Class Data pattern moves mutable state into a separate data object the main class reads; prevents accidental mutation and eases locking.',
  },
  tags: ['design', 'pattern', 'private-data', 'structural'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
