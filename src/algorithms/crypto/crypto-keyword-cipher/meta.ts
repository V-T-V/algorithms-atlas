// 关键字密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-keyword-cipher',
  categoryId: 'crypto',
  title: { zh: '关键字密码', en: 'Keyword Cipher' },
  summary: {
    zh: '由关键字生成替换表：先去重填入关键字字母，再顺次补全剩余字母。',
    en: 'Build a substitution table from a keyword: place unique keyword letters first, then remaining alphabet.',
  },
  description: {
    zh: '明文 A→关键字去重后的第 1 个字母，依次对应。区分大小写，非字母保留。',
    en: 'Plaintext A maps to the keyword-deduped first letter, etc. Case-sensitive, non-letters kept.',
  },
  tags: ['crypto', 'substitution', 'classical'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
