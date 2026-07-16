// hash-wyhash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-wyhash',
  categoryId: 'hashing',
  title: { zh: 'wyHash', en: 'wyHash' },
  summary: {
    zh: 'wyhash：当前最快的 64 位通用哈希之一，用于浏览器与游戏。',
    en: 'wyhash: one of the fastest general-purpose 64-bit hashes, used in browsers and games.',
  },
  description: {
    zh: 'wyhash（Wang Yi）：\n\n- 用 __uint128_t 风格的 wide multiply（BigInt 模拟）。\n- 读取 3 个 secret 常数做无名混合。\n- 在 SMHasher 上全通过，被 Zig/DuckDB 默认采用。本实现为简化 64 位 BigInt 版。',
    en: 'wyhash (Wang Yi):\n\n- Uses __uint128_t-style wide multiply (emulated via BigInt).\n- Reads 3 secret constants for unnamed mixing.\n- Passes SMHasher; default in Zig/DuckDB. Simplified 64-bit BigInt variant here.',
  },
  tags: ['hashing', 'non-cryptographic', 'wyhash'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
