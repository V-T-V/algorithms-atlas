import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-turing-machine',
  categoryId: 'parsing',
  title: { zh: '图灵机模拟', en: 'Turing Machine Simulator' },
  summary: {
    zh: '用双向纸带 + 有限状态控制模拟图灵机，识别递归可枚举语言。',
    en: 'Simulate a Turing machine: bidirectional tape + finite control.',
  },
  description: {
    zh: 'δ(q, a) = (q′, b, D)：状态、当前格 → 新状态、写入、读写头方向。',
    en: "delta(q, a) = (q', b, D): state and tape cell determine new state, written symbol, and head direction.",
  },
  tags: ['parsing', 'automaton', 'turing-machine'],
  complexity: { time: 'O(steps)', space: 'O(tape)' },
};
