// Poly1305 MAC（Poly1305）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-poly1305',
  categoryId: 'crypto',
  title: { zh: 'Poly1305 MAC', en: 'Poly1305' },
  summary: { zh: '基于模 2^130-5 的一次性 MAC。', en: 'One-time MAC mod 2^130-5.' },
  description: {
    zh: 'Poly1305(Bernstein)把消息分块视作 17 字节小端整数，对密钥 r 在模 (2^130-5) 下累加并乘以 r，输出 16 字节。',
    en: 'Poly1305 (Bernstein) treats message blocks as 17-byte little-endian ints, accumulating mod (2^130-5) multiplied by key r; outputs 16 bytes.',
  },
  tags: ['crypto', 'mac', 'poly1305'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
