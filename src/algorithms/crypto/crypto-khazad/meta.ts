// Khazad 密码（Khazad）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-khazad',
  categoryId: 'crypto',
  title: { zh: 'Khazad 密码', en: 'Khazad' },
  summary: { zh: '64 位分组 NESSIE 候选。', en: '64-bit block NESSIE candidate.' },
  description: {
    zh: 'Khazad(Barreto/Rijmen)是 64 位分组密码，与 Anubis 同源，采用 substitution-linear 结构，适合嵌入式。',
    en: 'Khazad (Barreto/Rijmen) is a 64-bit block cipher sharing Anubis lineage, substitution-linear, embedded-friendly.',
  },
  tags: ['crypto', 'khazad', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
