// RC5（RC5）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-rc5',
  categoryId: 'crypto',
  title: { zh: 'RC5', en: 'RC5' },
  summary: {
    zh: 'RC5：Rivest 的参数化 Feistel，加法 + 数据依赖旋转。',
    en: 'RC5: Rivest parameterized Feistel with addition + data-dependent rotation.',
  },
  description: {
    zh: 'RC5（Rivest 1994）参数化（w/r/b）分组密码，运算仅加法、异或、数据依赖旋转；适合软硬件。',
    en: 'RC5 (Rivest 1994) is a parameterized (w/r/b) Feistel cipher using only addition, xor, and data-dependent rotation; well-suited to hardware and software.',
  },
  tags: ['crypto', 'rc5', 'feistel', 'rotation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
