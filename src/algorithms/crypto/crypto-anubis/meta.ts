// Anubis 密码（Anubis）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-anubis',
  categoryId: 'crypto',
  title: { zh: 'Anubis 密码', en: 'Anubis' },
  summary: { zh: 'NESSIE 候选的 128 位分组密码。', en: '128-bit block cipher (NESSIE).' },
  description: {
    zh: 'Anubis(Barreto/Rijmen)是 128 位分组、密钥可变的 substitution-linear 网络，与 AES 类似的 S 盒结构。',
    en: 'Anubis (Barreto/Rijmen) is a 128-bit block, variable-key substitution-linear network sharing AES-like S-box structure.',
  },
  tags: ['crypto', 'anubis', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
