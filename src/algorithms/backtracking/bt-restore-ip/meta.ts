// 复原IP地址 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-restore-ip',
  categoryId: 'backtracking',
  title: { zh: '复原IP地址', en: 'Restore IP Addresses' },
  summary: {
    zh: '从字符串复原所有合法 IPv4 地址。',
    en: 'Restore all valid IPv4 addresses from a string.',
  },
  description: { zh: '回溯切 4 段，每段 0-255。', en: 'Backtrack 4 segments, 0-255 each. O(1).' },
  tags: ['backtracking', 'string'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
