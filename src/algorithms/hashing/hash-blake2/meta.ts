// hash-blake2 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-blake2',
  categoryId: 'hashing',
  title: { zh: 'BLAKE2', en: 'BLAKE2' },
  summary: {
    zh: 'BLAKE2b 哈希：基于 ChaCha 的压缩函数，比 SHA-2 快且抗碰撞。',
    en: 'BLAKE2b hash: ChaCha-style compression, faster than SHA-2 and collision-resistant.',
  },
  description: {
    zh: 'BLAKE2b（Aumasson 等）：\n\n- 基于 ChaCha 的 G 函数压缩，每轮混合消息字。\n- 支持密钥、可变输出长度、盐值。\n- 比 MD5/SHA-1 快，安全性等同 SHA-3。\n- 本实现为简化 64 位 BigInt 版（输出 256 位）。',
    en: 'BLAKE2b (Aumasson et al.):\n\n- ChaCha-style G-function compression mixing message words each round.\n- Supports keyed hashing, variable output length, and salt.\n- Faster than MD5/SHA-1 with SHA-3-level security.\n- This is a simplified 64-bit BigInt variant emitting 256 bits.',
  },
  tags: ['hashing', 'cryptographic', 'blake'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
