// ROT-N 旋转密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-rot-n',
  categoryId: 'crypto',
  title: { zh: 'ROT-N 旋转密码', en: 'ROT-N Cipher' },
  summary: {
    zh: '凯撒密码的推广，把每个字母在字母表中旋转 N 位（ROT13 为自反特例）。',
    en: 'Generalization of Caesar shifting each letter by N (ROT13 is the self-inverse special case).',
  },
  description: {
    zh: 'N 可为任意整数；ROT13 加密两次即还原。区分大小写，非字母保留。',
    en: 'Any integer N; ROT13 applied twice returns the original. Case-sensitive, non-letters kept.',
  },
  tags: ['crypto', 'substitution', 'classical'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
