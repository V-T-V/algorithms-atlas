// 842 压缩 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-842',
  categoryId: 'compression',
  title: { zh: '842 压缩', en: '842 Compression' },
  summary: {
    zh: 'IBM 842 硬件加速格式：固定模板检测 + 短回引，面向高吞吐。',
    en: 'IBM 842 hardware-accelerated format: fixed-template detection plus short back-references, tuned for throughput.',
  },
  description: {
    zh: 'IBM 842 压缩（Linux kernel 也支持）：\n\n- 以 8 字节为单位扫描，检测「全零」「重复模式」等固定模板。\n- 命中模板时输出极短的 op 码（如 2 位）。\n- 未命中则输出原始 8 字节或短距离回引。\n- 设计目标：硬件友好、固定延迟、低 CPU 开销。',
    en: 'IBM 842 compression (also in the Linux kernel):\n\n- Scan in 8-byte units, detecting fixed templates like all-zeros and repeated patterns.\n- Emit a very short opcode (e.g. 2 bits) on a hit.\n- On miss, emit raw 8 bytes or a short back-reference.\n- Goal: hardware-friendly, fixed latency, low CPU overhead.',
  },
  tags: ['compression', 'dictionary', 'hardware', 'lossless'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
