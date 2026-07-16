// μ-law 压扩（μ-law Companding）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-mulaw',
  categoryId: 'compression',
  title: { zh: 'μ-law 压扩', en: 'μ-law Companding' },
  summary: { zh: '语音对数压扩，提升小信号信噪比。', en: 'Logarithmic voice companding.' },
  description: {
    zh: 'μ-law(北美电话)用对数函数压缩 16-bit 线性 PCM 为 8-bit，提升小信号量化信噪比，与 A-law 同类。',
    en: 'μ-law (N. American telephony) compresses 16-bit linear PCM to 8-bit logarithmically, boosting small-signal SNR; sibling of A-law.',
  },
  tags: ['compression', 'mulaw', 'companding', 'audio'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
