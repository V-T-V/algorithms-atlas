// RC6（RC6）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-rc6',
  categoryId: 'crypto',
  title: { zh: 'RC6', en: 'RC6' },
  summary: {
    zh: 'RC6：RC6 加入乘法运算与 4 个寄存器。',
    en: 'RC6: extends RC5 with multiplication and 4 working registers.',
  },
  description: {
    zh: 'RC6（Rivest 等）AES 候选，在 RC5 基础上引入乘法（用于旋转量）并使用 4 个 32 位寄存器 A,B,C,D。',
    en: 'RC6 (Rivest et al.) is an AES finalist extending RC5 with multiplication (for rotation amounts) and four 32-bit registers A,B,C,D.',
  },
  tags: ['crypto', 'rc6', 'aes-finalist', 'rotation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
