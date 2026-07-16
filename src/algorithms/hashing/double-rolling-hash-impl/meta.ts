// 双模滚动哈希 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'double-rolling-hash-impl',
  categoryId: 'hashing',
  title: { zh: '双模滚动哈希', en: 'Double Rolling Hash' },
  summary: {
    zh: '用两对独立的 (base, P) 同时哈希，碰撞概率降至约 1/(P1·P2)。',
    en: 'Hash simultaneously with two independent (base, P) pairs, dropping collisions to ~1/(P1·P2).',
  },
  description: {
    zh: '单个多项式滚动哈希存在碰撞风险：两个不同子串哈希相同的概率约为 1/P。在竞赛或抗恶意输入场景下这不够安全。双模哈希（double hashing）用两套完全独立的参数 (base1, P1) 与 (base2, P2) 同时计算指纹，子串哈希组成有序对 (h1, h2)。两个子串「哈希相同」当且仅当 h1 与 h2 都相同，碰撞概率约为 1/(P1·P2)。取 P1=10^9+7、P2=10^9+9 时，联合碰撞概率约 10^-18，可视为无碰撞。常用 base 取 91138233、97266353、131、137 等。双哈希代价是两倍常数时间与空间，但换来对生日攻击与构造碰撞的强鲁棒性。子串查询、滚动、比较的接口与单哈希一致，只是返回元组。',
    en: 'A single polynomial rolling hash carries collision risk: two distinct substrings share a hash with probability about 1/P. This is insufficient for competitive programming or adversarial inputs. Double hashing computes fingerprints with two fully independent parameter sets (base1, P1) and (base2, P2) simultaneously; a substring fingerprint is the ordered pair (h1, h2). Two substrings are "hash-equal" only when both components agree, with collision probability about 1/(P1·P2). With P1=10^9+7 and P2=10^9+9 the joint collision probability is ~10^-18, effectively zero. Common bases are 91138233, 97266353, 131, 137. Double hashing costs twice the time and space but grants strong robustness against birthday attacks and constructed collisions. The substring-query, roll, and compare interfaces match the single hash, just returning tuples.',
  },
  tags: ['hashing', 'rolling-hash', 'polynomial', 'modular-arithmetic'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
