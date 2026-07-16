// BSGS 离散对数（BigInt 版）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'discrete-log-baby',
  categoryId: 'math',
  title: { zh: 'BSGS 离散对数（BigInt）', en: 'BSGS Discrete Logarithm (BigInt)' },
  summary: {
    zh: 'BigInt 版小步大步求 a^x ≡ b (mod m)，O(√m)。',
    en: 'BigInt baby-step giant-step solving a^x ≡ b (mod m) in O(√m).',
  },
  description: {
    zh: '离散对数问题：给定 a, b, m（gcd(a,m)=1），求最小非负 x 使 a^x ≡ b (mod m)。BSGS：设 t=⌈√order⌉，预存小步 {a^j mod m: j=0..t-1}，再以 t 步为单做大步 b·(a^{-t})^i 查表，命中则 x=i·t+j。时间空间均 O(√m)。本 BigInt 版用阶 m 的 Carmichael 上界 order=m-1（m 素数时即阶），适合大模数。',
    en: 'Discrete logarithm: given a, b, m (gcd(a,m)=1), find the minimal non-negative x with a^x ≡ b (mod m). BSGS: let t=⌈√order⌉, pre-store baby steps {a^j mod m: j=0..t-1}, then take giant steps b·(a^{-t})^i and look up; on hit x=i·t+j. Time and space O(√m). This BigInt version uses order upper bound m-1 (the order when m is prime), suited to large moduli.',
  },
  tags: ['math', 'number-theory', 'discrete-log', 'bsgs'],
  complexity: { time: 'O(√m)', space: 'O(√m)' },
};
