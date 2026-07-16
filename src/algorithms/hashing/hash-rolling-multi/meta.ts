// hash-rolling-multi · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-rolling-multi',
  categoryId: 'hashing',
  title: { zh: 'Rolling Hash (多基)', en: 'Rolling Hash (multi-base)' },
  summary: {
    zh: '滚动哈希：滑动窗口下 O(1) 更新的多项式哈希，用于 Rabin-Karp / 字符串匹配。',
    en: 'Rolling hash: O(1) sliding-window polynomial hash used for Rabin-Karp string matching.',
  },
  description: {
    zh: '滚动哈希（Karp-Rabin）：\n\n- 对窗口内字节做多项式 h = sum(b[i] * base^(L-1-i)) mod P。\n- 滑出旧字节、滑入新字节时只需 O(1)：h = (h - old*base^(L-1)) * base + new。\n- 双素数模（10^9+7 / 10^9+9）抗碰撞。本实现返回单 32 位无符号。',
    en: 'Rolling hash (Karp-Rabin):\n\n- Polynomial h = sum(b[i] * base^(L-1-i)) mod P over the window.\n- Sliding out old / in new byte is O(1): h = (h - old*base^(L-1)) * base + new.\n- Dual-prime mod (10^9+7 / 10^9+9) resists collision. Returns single 32-bit unsigned here.',
  },
  tags: ['hashing', 'rolling', 'rabin-karp', 'string-matching'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
