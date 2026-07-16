// 过滤器链（Filter Chain）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-filter-chain',
  categoryId: 'design',
  title: { zh: '过滤器链', en: 'Filter Chain' },
  summary: {
    zh: '过滤器链：依次过滤，任一可终止链。',
    en: 'Filter chain: apply filters in order; any may terminate the chain.',
  },
  description: {
    zh: '过滤器链（Filter Chain）把请求依次通过多个 filter，每个 filter 可放行或拒绝（短路）。常用于 Web 请求校验、防火墙。',
    en: 'Filter Chain passes a request through filters sequentially; each filter can allow or reject (short-circuit). Used in web request validation, firewalls.',
  },
  tags: ['design', 'filter', 'chain', 'validation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
