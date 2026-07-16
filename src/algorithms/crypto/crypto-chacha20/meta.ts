// ChaCha20 流密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-chacha20',
  categoryId: 'crypto',
  title: { zh: 'ChaCha20 流密码', en: 'ChaCha20 Stream Cipher' },
  summary: {
    zh: 'Salsa20 的改进版，旋转常量改为 16/12/8/7，广泛用于 TLS 与现代加密栈。',
    en: 'Improved Salsa20 with rotation constants 16/12/8/7; widely used in TLS and modern crypto stacks.',
  },
  description: {
    zh: '每轮对列与行做 quarter-round：a+=b; d^=a; d=rot(d,16)；c+=d; b^=c; b=rot(b,12)；…共 20 轮。',
    en: 'Each round applies quarter-rounds to columns then rows: add/xor/rotate with constants 16,12,8,7; 20 rounds total.',
  },
  tags: ['crypto', 'stream', 'arx', 'symmetric'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
