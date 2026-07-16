// hash-siphash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-siphash',
  categoryId: 'hashing',
  title: { zh: 'SipHash', en: 'SipHash' },
  summary: {
    zh: 'SipHash-2-4：ARX 流密码式哈希，抗碰撞，用于哈希表防 HashDoS。',
    en: 'SipHash-2-4: ARX stream-cipher-style hash, collision-resistant, used to defend hash tables from HashDoS.',
  },
  description: {
    zh: 'SipHash-2-4（Aumasson & Bernstein）：\n\n- 用 128 位密钥初始化 4 个 64 位字 v0..v3。\n- 每 8 字节做 2 轮 SipRound（rotate+xor+add）。\n- 末尾处理剩余字节和长度，再做 4 轮 SipRound。\n- 输出 64 位。抗碰撞，Rust/Python 默认用它防 HashDoS。',
    en: 'SipHash-2-4 (Aumasson & Bernstein):\n\n- Initialize four 64-bit words v0..v3 from a 128-bit key.\n- Apply 2 SipRound rounds (rotate+xor+add) per 8-byte block.\n- Handle remaining bytes and length, then 4 more SipRound rounds.\n- Emits 64 bits. Collision-resistant; default in Rust/Python to stop HashDoS.',
  },
  tags: ['hashing', 'cryptographic', 'siphash', 'dos-resistant'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
