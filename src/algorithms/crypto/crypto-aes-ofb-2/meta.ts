// AES-OFB v2（AES-OFB v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-aes-ofb-2',
  categoryId: 'crypto',
  title: { zh: 'AES-OFB v2', en: 'AES-OFB v2' },
  summary: {
    zh: 'AES-OFB：输出反馈模式，前一块密钥流作下一块输入。',
    en: 'AES-OFB: output feedback; previous keystream block feeds next.',
  },
  description: {
    zh: 'AES-OFB 用 AES(IV) 生成第一块密钥流，之后每次把上一块密钥流再喂入 AES。错误不扩散，适合噪声信道。',
    en: 'AES-OFB uses AES(IV) for the first keystream block then feeds the previous keystream block back into AES; errors do not propagate, suited to noisy channels.',
  },
  tags: ['crypto', 'aes', 'ofb', 'stream'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
