// Murmur 终结子（Murmur Finalizer）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-murmur-finalizer',
  categoryId: 'hashing',
  title: { zh: 'Murmur 终结子', en: 'Murmur Finalizer' },
  summary: {
    zh: 'Murmur3 fmix32 雪崩函数：三次异或-乘法混合，将弱散列打乱为均匀分布。',
    en: 'Murmur3 fmix32 avalanche: three xor-multiply mixes turn weak hashes into uniform distribution.',
  },
  description: {
    zh: 'fmix32：h^=h>>>16; h*=0x85ebca6b; h^=h>>>13; h*=0xc2b2ae35; h^=h>>>16。常用于哈希后置处理提升雪崩。',
    en: 'fmix32: h^=h>>>16; h*=0x85ebca6b; h^=h>>>13; h*=0xc2b2ae35; h^=h>>>16. Post-mix to improve avalanche.',
  },
  tags: ['hashing', 'avalanche', 'finalizer'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
