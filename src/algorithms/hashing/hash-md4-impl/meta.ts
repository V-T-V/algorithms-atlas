// MD4（简化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-md4-impl',
  categoryId: 'hashing',
  title: { zh: 'MD4（简化）', en: 'MD4 (simplified)' },
  summary: {
    zh: 'MD4：Rivest 1990 的 128 位消息摘要，已被攻破但有历史意义。',
    en: 'MD4: Rivest 1990 128-bit digest, broken but historically significant.',
  },
  description: {
    zh: 'MD4 是 MD5、SHA 系列的前身。每 64 字节块三轮非线性混合。本实现是 256 位 BigInt 教学简化版（非标准）。',
    en: 'MD4 is the precursor to MD5 and the SHA family. Each 64-byte block undergoes three non-linear rounds. Simplified 256-bit BigInt teaching version (non-standard).',
  },
  tags: ['hashing', 'cryptographic', 'legacy'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
