// 扩展维吉尼亚密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-vigenere-extended',
  categoryId: 'crypto',
  title: { zh: '扩展维吉尼亚密码', en: 'Extended Vigenère Cipher' },
  summary: {
    zh: '把经典维吉尼亚扩展到 A-Z + 0-9 共 36 字符表，多表替换。',
    en: 'Extends classical Vigenère to a 36-symbol alphabet (A-Z, 0-9), still polyalphabetic.',
  },
  description: {
    zh: '密钥循环使用：密文 = (明文字符 + 密钥字符) mod 36，按自定义字符集索引计算。',
    en: 'Key cycles: cipher = (plain + key) mod 36 over a custom alphabet indexing.',
  },
  tags: ['crypto', 'polyalphabetic', 'classical'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
