// Brotli v2（Brotli v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-brotli-2',
  categoryId: 'compression',
  title: { zh: 'Brotli v2', en: 'Brotli v2' },
  summary: {
    zh: 'Brotli：LZ77 + 上下文建模 + 静态字典，Web 优化。',
    en: 'Brotli: LZ77 + context modeling + static dictionary, web-optimized.',
  },
  description: {
    zh: 'Brotli（Google）针对 Web 优化：LZ77 + 二阶上下文建模 + 内置 120KB 静态字典（含常见 Web 文本）。',
    en: 'Brotli (Google) is web-optimized: LZ77 + second-order context modeling + a built-in 120KB static dictionary of common web text.',
  },
  tags: ['compression', 'brotli', 'lz', 'context', 'web'],
  complexity: { time: 'O(n·w)', space: 'O(w + dict)' },
};
