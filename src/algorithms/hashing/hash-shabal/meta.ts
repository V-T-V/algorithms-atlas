// Shabal（简化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-shabal',
  categoryId: 'hashing',
  title: { zh: 'Shabal（简化）', en: 'Shabal (simplified)' },
  summary: {
    zh: 'Shabal：可变长度密码学哈希，使用宽管线和复杂轮函数。',
    en: 'Shabal: variable-length cryptographic hash using a wide pipeline and complex round function.',
  },
  description: {
    zh: 'Shabal（Saphyr2 候选）：基于「输入→A/B/C 三组寄存器」的复杂密码学哈希。本实现是 256 位 BigInt 教学简化版。',
    en: 'Shabal (Saphyr2 candidate): cryptographic hash over three register banks A/B/C. Simplified 256-bit BigInt teaching version.',
  },
  tags: ['hashing', 'cryptographic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
