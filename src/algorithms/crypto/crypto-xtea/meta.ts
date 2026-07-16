// XTEA 扩展 TEA · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-xtea',
  categoryId: 'crypto',
  title: { zh: 'XTEA 扩展 TEA', en: 'eXtended TEA (XTEA)' },
  summary: {
    zh: 'TEA 的改进版：用 key[(sum & 3)…] 选择密钥字，结构更难被差分攻击。',
    en: 'Improved TEA variant: selects key words via key[(sum&3)…], resisting related-key attacks better.',
  },
  description: {
    zh: '每轮通过 sum 低位索引密钥字，做两次移位+异或混合。32 轮默认。',
    en: 'Each round uses low bits of sum to index key words, mixing with double shifts and XORs. 32 rounds default.',
  },
  tags: ['crypto', 'block', 'feistel', 'symmetric'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
