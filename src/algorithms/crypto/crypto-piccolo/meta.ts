// Piccolo 轻量密码（Piccolo）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-piccolo',
  categoryId: 'crypto',
  title: { zh: 'Piccolo 轻量密码', en: 'Piccolo' },
  summary: {
    zh: '64 位广义 Feistel 轻量密码。',
    en: '64-bit generalized Feistel lightweight cipher.',
  },
  description: {
    zh: 'Piccolo(Shirai 等)是 64 位分组轻量密码，采用 4 分支广义 Feistel，面向硬件极小面积设计。',
    en: 'Piccolo (Shirai et al.) is a 64-bit lightweight cipher with a 4-branch generalized Feistel for minimal hardware area.',
  },
  tags: ['crypto', 'piccolo', 'lightweight', 'feistel'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
