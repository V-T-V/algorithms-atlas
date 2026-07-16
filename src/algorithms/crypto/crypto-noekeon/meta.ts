// Noekeon 密码（Noekeon）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-noekeon',
  categoryId: 'crypto',
  title: { zh: 'Noekeon 密码', en: 'Noekeon' },
  summary: { zh: 'NESSIE 推荐的 128 位分组密码。', en: '128-bit block cipher (NESSIE).' },
  description: {
    zh: 'Noekeon 是 Daemen 等设计的 128 位分组直接/间接模式密码，16 轮，结构简洁适合硬件。',
    en: 'Noekeon (Daemen et al.) is a 128-bit block cipher in 16 rounds, direct/indirect modes, hardware-friendly.',
  },
  tags: ['crypto', 'noekeon', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
