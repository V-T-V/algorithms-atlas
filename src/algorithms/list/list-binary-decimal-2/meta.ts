// 二进制转十进制 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-binary-decimal-2',
  categoryId: 'list',
  title: { zh: '二进制转十进制', en: 'Binary List to Decimal' },
  summary: {
    zh: '链表每个节点是 0/1，从高位到低位表示二进制数，求十进制值。',
    en: 'Each node holds a bit (MSB first); compute the decimal value.',
  },
  description: {
    zh: '从高到低：ans = ans * 2 + bit。',
    en: 'ans = ans*2 + bit, MSB first. O(n), O(1).',
  },
  tags: ['list', 'binary', 'conversion'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
