// 心理扑克协议（Mental Poker Protocol）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-mental-poker',
  categoryId: 'game',
  title: { zh: '心理扑克协议', en: 'Mental Poker Protocol' },
  summary: {
    zh: '不借助可信发牌人，用交换式加密实现公平发牌。',
    en: 'Fair card dealing without a trusted dealer, via commutative encryption exchanges.',
  },
  description: {
    zh: '心理扑克：A、B 各持密钥，对牌组依次加密、洗牌、解密。由于交换性 E_a(E_b(c))=E_b(E_a(c))，双方都无法单独知道牌面。',
    en: 'Mental poker: A and B hold keys, encrypt/shuffle/decrypt the deck in turns. Commutativity E_a(E_b(c))=E_b(E_a(c)) keeps cards hidden from each alone.',
  },
  tags: ['game', 'cryptography', 'protocol'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
