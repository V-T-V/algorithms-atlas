// PRESENT 轻量密码（PRESENT Cipher）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-present',
  categoryId: 'crypto',
  title: { zh: 'PRESENT 轻量密码', en: 'PRESENT Cipher' },
  summary: { zh: '面向 RFID 的 64 位轻量密码。', en: 'Lightweight 64-bit cipher for RFID.' },
  description: {
    zh: 'PRESENT(ISO/IEC 29192)是面向资源受限设备的 64 位分组、80/128 位密钥轻量密码， substitution-permutation 结构。',
    en: 'PRESENT (ISO/IEC 29192) is a 64-bit block, 80/128-bit key lightweight SPN cipher for constrained devices.',
  },
  tags: ['crypto', 'present', 'lightweight', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
