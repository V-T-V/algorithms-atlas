// RC4 随机数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-rc4-rng',
  categoryId: 'randomized',
  title: { zh: 'RC4 随机数生成器', en: 'RC4 RNG' },
  summary: {
    zh: '复用 RC4 密钥调度（KSA）+ 伪随机生成（PRGA）做流式随机。',
    en: 'Reuses RC4 key scheduling (KSA) + pseudo-random generation (PRGA) as a stream RNG.',
  },
  description: {
    zh: 'RC4 是流密码，其 PRGA 输出可作为伪随机字节流。KSA 用种子打乱 256 字节 S 盒，PRGA 每次交换并输出一字节。注意：作为 RNG 仅用于教学，RC4 已不安全。',
    en: 'RC4 is a stream cipher whose PRGA output serves as a pseudo-random byte stream. KSA shuffles a 256-byte S-box from the seed; PRGA swaps and emits one byte per step. Note: educational only; RC4 is cryptographically broken.',
  },
  tags: ['randomized', 'prng', 'rc4', 'stream-cipher'],
  complexity: { time: 'O(1)', space: 'O(256)' },
};
