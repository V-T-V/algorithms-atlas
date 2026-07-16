// OFB 模式（通用）（OFB Mode (Generic)）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-ofb-mode-generic',
  categoryId: 'crypto',
  title: { zh: 'OFB 模式（通用）', en: 'OFB Mode (Generic)' },
  summary: { zh: '密钥流独立于明文。', en: 'Keystream independent of plaintext.' },
  description: {
    zh: 'OFB(Output Feedback)反复加密反馈寄存器生成密钥流，与明文异或，错误不传播，适合流式。',
    en: 'OFB repeatedly encrypts a feedback register to form a keystream XORed with plaintext; errors do not propagate.',
  },
  tags: ['crypto', 'ofb', 'mode-of-operation', 'stream'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
