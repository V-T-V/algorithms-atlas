// Speck 轻量密码（Speck）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-speck',
  categoryId: 'crypto',
  title: { zh: 'Speck 轻量密码', en: 'Speck' },
  summary: { zh: 'NSA 设计的软件友好 ARX。', en: 'Software-friendly ARX by NSA.' },
  description: {
    zh: 'Speck(NSA)是与 Simon 成对的轻量密码，采用 Add-Rotate-XOR(ARX)结构，软件实现极快。',
    en: 'Speck (NSA) pairs with Simon using Add-Rotate-Xor (ARX), extremely fast in software.',
  },
  tags: ['crypto', 'speck', 'lightweight', 'arx'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
