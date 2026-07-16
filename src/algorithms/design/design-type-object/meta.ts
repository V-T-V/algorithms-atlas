// 类型对象模式（Type Object）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-type-object',
  categoryId: 'design',
  title: { zh: '类型对象模式', en: 'Type Object' },
  summary: { zh: '把类型抽成可共享数据对象。', en: 'Lift type info into a shared data object.' },
  description: {
    zh: '类型对象模式把一个类的共享属性(名字、最大血量、抗性)抽成单独的类型对象，实例引用它，便于动态加新类型。',
    en: 'The Type Object pattern extracts shared class data (name, max HP, resist) into a separate type object referenced by instances, easing dynamic new types (e.g. game units).',
  },
  tags: ['design', 'pattern', 'type-object', 'structural'],
  complexity: { time: 'O(1)', space: 'O(t)' },
};
