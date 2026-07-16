// Spectral Hash（简化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-spectral',
  categoryId: 'hashing',
  title: { zh: 'Spectral Hash（简化）', en: 'Spectral Hash (simplified)' },
  summary: {
    zh: 'Spectral：基于矩阵变换的密码学哈希，模拟频谱扩散。',
    en: 'Spectral: matrix-transform-based cryptographic hash simulating spectral diffusion.',
  },
  description: {
    zh: 'Spectral Hash：把状态视为「频谱」，通过类 DFT 的混合实现雪崩。本实现是 256 位简化教学版。',
    en: 'Spectral Hash: treats state as a "spectrum" and achieves avalanche via DFT-like mixing. Simplified 256-bit teaching version.',
  },
  tags: ['hashing', 'cryptographic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
