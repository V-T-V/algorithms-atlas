// 扩展 RC4 流密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-rc4-extended',
  categoryId: 'crypto',
  title: { zh: '扩展 RC4 流密码', en: 'Extended RC4 Stream Cipher' },
  summary: {
    zh: '经典 RC4 的教学实现：KSA 初始化 256 字节状态，PRGA 生成密钥流，逐字节异或。',
    en: 'Educational RC4: KSA initializes a 256-byte state, PRGA emits keystream bytes, XORed with plaintext.',
  },
  description: {
    zh: 'KSA 用密钥打乱 S-盒；PRGA 每次交换两字节输出一个伪随机字节。教学用途，非安全实现。',
    en: 'KSA shuffles an S-box with the key; PRGA swaps two bytes each step to produce pseudo-random bytes. Educational, not secure.',
  },
  tags: ['crypto', 'stream', 'symmetric'],
  complexity: { time: 'O(n+256)', space: 'O(256)' },
};
