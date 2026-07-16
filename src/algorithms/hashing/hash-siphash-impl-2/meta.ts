// SipHash（SipHash）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-siphash-impl-2',
  categoryId: 'hashing',
  title: { zh: 'SipHash', en: 'SipHash' },
  summary: {
    zh: 'ARX 结构带密钥哈希，抗碰撞攻击，哈希表默认选择。',
    en: 'Keyed ARX hash resistant to collision attacks; default in many hash tables.',
  },
  description: {
    zh: 'SipHash：带 128 位密钥，每轮 2 次 SipRound（旋转+加+异或）。抗 HashDoS，Rust/Python 默认。',
    en: 'SipHash: 128-bit key, 2 SipRound per round (rotate+add+xor). HashDoS-resistant, default in Rust/Python.',
  },
  tags: ['hashing', 'cryptographic', 'siphash'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
