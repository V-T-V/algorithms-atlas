// 全域哈希族 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'universal-hashing-impl',
  categoryId: 'hashing',
  title: { zh: '全域哈希族', en: 'Universal Hashing' },
  summary: {
    zh: '随机从族 H={hₐ,b} 选取，对任意 x≠y 碰撞概率 ≤ 1/m，对抗恶意输入。',
    en: 'Pick randomly from H={hₐ,b}; for any x≠y collision prob ≤ 1/m, defeating adversarial inputs.',
  },
  description: {
    zh: '全域哈希（universal hashing）由 Carter 与 Wegman（1979）提出，核心思想是不再使用某个固定哈希函数，而是从一个哈希族 H 中「随机」选取一个。这能抵御对手针对固定哈希函数构造最坏输入的攻击。经典构造：取素数 p（≥ 键域大小），族 H = { h_{a,b}(x) = ((a·x + b) mod p) mod m : a ∈ {1,…,p−1}, b ∈ {0,…,p−1} }。可证明：对任意不同的 x、y，Pr_{a,b}[h_{a,b}(x) = h_{a,b}(y)] ≤ 1/m。这正是「全域」的定义。当 m 为槽位数时，期望冲突链长度有界，哈希表在对手任意输入下仍有期望 O(1) 操作（配合链地址法）。本实现提供该族的随机抽样与单次哈希计算，并演示对一组键的桶分配与冲突统计。',
    en: 'Universal hashing, introduced by Carter and Wegman (1979), abandons any single fixed hash function in favour of choosing one at random from a family H. This defeats adversaries who craft worst-case inputs against a known hash. The classic construction: choose a prime p (≥ the key universe size) and let H = { h_{a,b}(x) = ((a·x + b) mod p) mod m : a ∈ {1,…,p−1}, b ∈ {0,…,p−1} }. One can prove that for any distinct x, y, Pr_{a,b}[h_{a,b}(x) = h_{a,b}(y)] ≤ 1/m — exactly the definition of "universal". With m slots, expected chain length is bounded, so a hash table (with chaining) achieves expected O(1) operations under any adversarial input. This implementation provides random sampling from the family, single-hash evaluation, and a demo of bucket assignment with collision statistics over a key set.',
  },
  tags: ['hashing', 'universal', 'randomized', 'hash-family'],
  complexity: { time: 'O(1) 每次哈希', space: 'O(1)' },
};
