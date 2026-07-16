// CMAC 认证码（CMAC）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-cmac',
  categoryId: 'crypto',
  title: { zh: 'CMAC 认证码', en: 'CMAC' },
  summary: { zh: '基于分组密码的 MAC。', en: 'MAC based on a block cipher.' },
  description: {
    zh: 'CMAC(NIST SP 800-38B)用分组密码(AES)和子密钥 K1/K2 对消息认证，末块按是否整块选择子密钥。',
    en: 'CMAC (NIST SP 800-38B) authenticates a message with a block cipher and subkeys K1/K2, choosing by whether the last block is full.',
  },
  tags: ['crypto', 'mac', 'cmac'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
