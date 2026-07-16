// 3-Way 密码（3-Way）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-3way',
  categoryId: 'crypto',
  title: { zh: '3-Way 密码', en: '3-Way' },
  summary: { zh: '96 位分组硬件友好密码。', en: '96-bit hardware-friendly cipher.' },
  description: {
    zh: '3-Way(Daemen)是 96 位分组、12 轮密码，设计为 32 位硬件并行运算，无 S 盒的代数结构。',
    en: '3-Way (Daemen) is a 96-bit block, 12-round cipher designed for 32-bit hardware, S-box-free algebraic structure.',
  },
  tags: ['crypto', '3way', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
