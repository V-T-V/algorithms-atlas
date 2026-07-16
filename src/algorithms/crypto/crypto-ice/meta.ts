// ICE 密码（ICE）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-ice',
  categoryId: 'crypto',
  title: { zh: 'ICE 密码', en: 'ICE' },
  summary: { zh: '64 位 Feistel 商业密码。', en: '64-bit Feistel commercial cipher.' },
  description: {
    zh: 'ICE(Information Concealment Engine)是 DES 改进型 64 位 Feistel，密钥可变，有弱密钥检测的商业密码。',
    en: 'ICE (Information Concealment Engine) is a DES-like 64-bit Feistel with variable key length and weak-key detection.',
  },
  tags: ['crypto', 'ice', 'feistel', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
