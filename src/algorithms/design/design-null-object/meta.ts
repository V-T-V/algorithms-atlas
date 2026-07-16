// 空对象模式（Null Object）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-null-object',
  categoryId: 'design',
  title: { zh: '空对象模式', en: 'Null Object' },
  summary: { zh: '用中性对象替代 null 检查。', en: 'Neutral object replaces null checks.' },
  description: {
    zh: '空对象模式提供一个实现相同接口但无操作的默认对象，消除调用方的 null 判断分支。',
    en: 'The Null Object pattern provides a default no-op object implementing the same interface, removing null-check branches in callers.',
  },
  tags: ['design', 'pattern', 'null-object', 'behavioral'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
