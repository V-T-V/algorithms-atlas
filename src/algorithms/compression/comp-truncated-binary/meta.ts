// 截断二进制（Truncated Binary）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-truncated-binary',
  categoryId: 'compression',
  title: { zh: '截断二进制', en: 'Truncated Binary' },
  summary: {
    zh: '非 2 的幂范围的最优定长码。',
    en: 'Optimal fixed-width for non-power-of-2 range.',
  },
  description: {
    zh: '截断二进制编码把 0..n-1(n 非 2 的幂)用 ⌊log2 n⌋ 或 ⌈log2 n⌉ 位表示，比统一 ⌈log2 n⌉ 位节省约 1 位。',
    en: 'Truncated binary encodes 0..n-1 (n not a power of two) in ⌊log2 n⌋ or ⌈log2 n⌉ bits, saving ~1 bit over uniform ⌈log2 n⌉.',
  },
  tags: ['compression', 'truncated-binary', 'prefix-code'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
