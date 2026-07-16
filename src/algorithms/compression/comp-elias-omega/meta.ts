// Elias Omega · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-elias-omega',
  categoryId: 'compression',
  title: { zh: 'Elias Omega 编码', en: 'Elias Omega Coding' },
  summary: {
    zh: '递归式前缀码：不断把「当前数的位数」作为新数前缀，直到降到 1。',
    en: 'A recursive prefix code: repeatedly prepend the bit-length of the current number until reaching 1.',
  },
  description: {
    zh: 'Elias omega 编码（递归式）：\n\n1. 从 N 开始，设 N 的二进制为 bin(N)。\n2. 把 bin(N) 的位数减 1（即 ⌊log2 N⌋）作为一个新数 K，把 bin(K) 作为组前缀写到 bin(N) 前。\n3. 递归处理 K，直到 K == 0，最后补一个 0 终止位。\n\n比 gamma/delta 更紧凑，是最优的通用整数编码之一。',
    en: 'Elias omega coding (recursive):\n\n1. Start from N, let bin(N) be its binary.\n2. Let K = bit-length(N) - 1, prepend bin(K) before bin(N).\n3. Recurse on K until K == 0, then append a terminating 0 bit.\n\nMore compact than gamma/delta; one of the optimal universal integer codes.',
  },
  tags: ['compression', 'entropy', 'prefix-free'],
  complexity: { time: 'O(log* n)', space: 'O(log n)' },
};
