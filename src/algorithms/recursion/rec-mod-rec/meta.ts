// 递归取模 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-mod-rec',
  categoryId: 'recursion',
  title: { zh: '递归取模', en: 'Recursive Modulo' },
  summary: {
    zh: 'a mod b：递归从 a 中减 b 直到 a < b。',
    en: 'a mod b: recursively subtract b from a until a < b.',
  },
  description: {
    zh: '递归取模：通过反复减法实现，演示取模的本质。',
    en: 'Recursive modulo: implemented by repeated subtraction to reveal the essence of mod.',
  },
  tags: ['recursion', 'arithmetic'],
  complexity: { time: 'O(a/b)', space: 'O(a/b)' },
};
