// 规约模式（Specification）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-specification',
  categoryId: 'design',
  title: { zh: '规约模式', en: 'Specification' },
  summary: { zh: '用可组合谓词表达业务规则。', en: 'Composable predicates for business rules.' },
  description: {
    zh: '规约模式把每条业务规则封装成对象，提供 and/or/not 组合，使规则可复用、可测试、可链式组合。',
    en: 'The Specification pattern wraps each rule as a composable object with and/or/not, enabling reuse, testing, and chaining.',
  },
  tags: ['design', 'pattern', 'specification', 'behavioral'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
