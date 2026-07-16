// 购物折扣（贪心凑单）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-discount',
  categoryId: 'greedy',
  title: { zh: '购物折扣（贪心凑单）', en: 'Shopping Discount (Greedy Bundling)' },
  summary: {
    zh: '给定若干商品价格与"满 threshold 减 deduction"规则，求购买总成本最低。',
    en: 'Given item prices and a "spend threshold, get deduction" coupon, minimize total cost.',
  },
  description: {
    zh: '把商品降序排序，贪心打包：每组累计达到 threshold 即减免 deduction，剩余无法成组的原价支付。',
    en: 'Sort items descending and greedily bundle: each group reaching threshold earns the deduction; leftovers pay full price.',
  },
  tags: ['greedy', 'sorting', 'bundle'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
