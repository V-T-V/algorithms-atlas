// Trivium 流密码（Trivium）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-trivium',
  categoryId: 'crypto',
  title: { zh: 'Trivium 流密码', en: 'Trivium' },
  summary: { zh: 'eSTREAM 硬件友好流密码。', en: 'eSTREAM hardware-friendly stream cipher.' },
  description: {
    zh: 'Trivium(De Cannière/Preneel)用 3 个互连的 288 位移位寄存器，每轮输出 1 bit，硬件极简速度高。',
    en: 'Trivium (De Cannière/Preneel) uses 3 interconnected 288-bit shift registers outputting 1 bit per cycle; tiny hardware, high speed.',
  },
  tags: ['crypto', 'trivium', 'stream', 'hardware'],
  complexity: { time: 'O(n)', space: 'O(288)' },
};
