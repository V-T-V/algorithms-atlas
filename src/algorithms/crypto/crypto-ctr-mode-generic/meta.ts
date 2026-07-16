// CTR 模式（通用）（CTR Mode (Generic)）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-ctr-mode-generic',
  categoryId: 'crypto',
  title: { zh: 'CTR 模式（通用）', en: 'CTR Mode (Generic)' },
  summary: { zh: '加密计数器生成密钥流。', en: 'Encrypts a counter as keystream.' },
  description: {
    zh: 'CTR(Counter)模式加密递增计数器生成密钥流，可并行/预计算，是现代推荐的流式分组模式。',
    en: 'CTR encrypts an incrementing counter to produce a keystream; parallelizable and precomputable, a modern recommended mode.',
  },
  tags: ['crypto', 'ctr', 'mode-of-operation', 'stream'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
