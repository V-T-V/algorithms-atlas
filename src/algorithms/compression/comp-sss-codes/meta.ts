// Start-Step-Stop 编码（Start-Step-Stop Codes）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-sss-codes',
  categoryId: 'compression',
  title: { zh: 'Start-Step-Stop 编码', en: 'Start-Step-Stop Codes' },
  summary: { zh: '可调参数族一元类编码。', en: 'Parameterized family of unary-like codes.' },
  description: {
    zh: 'Start-Step-Stop 编码(明确 n)用 (start, step, stop) 三参数控制不同区段的一元位数，是一类前缀码的通用框架。',
    en: 'Start-Step-Stop codes (Elias) use (start, step, stop) to control unary length per range, a general framework of prefix codes.',
  },
  tags: ['compression', 'sss', 'prefix-code'],
  complexity: { time: 'O(1) per value', space: 'O(n)' },
};
