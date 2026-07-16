// 扩展埃特巴什密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-atbash-extended',
  categoryId: 'crypto',
  title: { zh: '扩展埃特巴什密码', en: 'Extended Atbash Cipher' },
  summary: {
    zh: '把字母 A↔Z、B↔Y 镜像映射，并对数字 0↔9 也做反转。',
    en: 'Mirror-map letters A↔Z, B↔Y, and also reverse digits 0↔9.',
  },
  description: {
    zh: '经典 Atbash 的扩展：字母 c → 25-(c-A)，数字 d → 9-d。自反，无密钥。',
    en: 'Extended Atbash: letter c → 25-(c-A), digit d → 9-d. Self-inverse, keyless.',
  },
  tags: ['crypto', 'substitution', 'classical'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
