// 上下文自适应算术编码（Context-Adaptive Arithmetic）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-arith-context',
  categoryId: 'compression',
  title: { zh: '上下文自适应算术编码', en: 'Context-Adaptive Arithmetic' },
  summary: {
    zh: '依上下文动态调整概率的算术编码。',
    en: 'Arithmetic coding with context-driven probability.',
  },
  description: {
    zh: '上下文自适应算术编码按近期历史(上下文)维护符号概率并动态更新，常用于二值图像 JBIG/H.264 CABAC。',
    en: 'Context-adaptive arithmetic coding maintains per-context symbol probabilities that adapt online (JBIG, CABAC).',
  },
  tags: ['compression', 'arithmetic', 'context-adaptive'],
  complexity: { time: 'O(n)', space: 'O(c)' },
};
