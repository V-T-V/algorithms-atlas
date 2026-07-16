// TEA 微型加密算法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-tea',
  categoryId: 'crypto',
  title: { zh: 'TEA 微型加密算法', en: 'Tiny Encryption Algorithm (TEA)' },
  summary: {
    zh: '128 位密钥、64 位分组的 Feistel 分组密码，32 轮，结构极简。',
    en: 'A Feistel block cipher with a 128-bit key and 64-bit block over 32 rounds — famously compact.',
  },
  description: {
    zh: '每轮用加法、移位与密钥字混合两个 32 位半块，交替更新。delta=0x9E3779B9 控制轮间错位。',
    en: 'Each round mixes two 32-bit halves with add/shift and key words alternately; delta=0x9E3779B9 decorrelates rounds.',
  },
  tags: ['crypto', 'block', 'feistel', 'symmetric'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
