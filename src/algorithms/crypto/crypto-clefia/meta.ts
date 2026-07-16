// Clefia 密码（Clefia）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-clefia',
  categoryId: 'crypto',
  title: { zh: 'Clefia 密码', en: 'Clefia' },
  summary: { zh: '索尼 128 位分组密码。', en: 'Sony 128-bit block cipher.' },
  description: {
    zh: 'Clefia(索尼)是 128 位分组、128/192/256 位密钥密码，采用 Type-2 广义 Feistel，ISO/IEC 29192 标准。',
    en: 'Clefia (Sony) is a 128-bit block cipher with 128/192/256-bit keys using a Type-2 generalized Feistel (ISO/IEC 29192).',
  },
  tags: ['crypto', 'clefia', 'block', 'feistel'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
