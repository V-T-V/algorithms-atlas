import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-rolling-3',
  categoryId: 'string',
  title: { zh: '滚动哈希（窗口哈希）', en: 'Rolling Hash (Sliding Window)' },
  summary: {
    zh: '维护定长滑动窗口的哈希，O(1) 更新，用于指纹去重。',
    en: 'Maintains a fixed-length sliding-window hash updated in O(1); used for fingerprinting.',
  },
  description: {
    zh: '出窗字符按最高位权重减去，入窗字符加到低位，再乘以 base。',
    en: 'Subtract the leaving char (weighted by highest power), add the entering char at the low end, then multiply by base.',
  },
  tags: ['string', 'rolling-hash', 'window'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
