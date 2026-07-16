// 窥孔优化 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-peephole',
  categoryId: 'parsing',
  title: { zh: '窥孔优化', en: 'Peephole Optimization' },
  summary: {
    zh: '在目标/中间代码的小窗口内做局部模式替换：冗余 load/store、代数恒等、强度削减。',
    en: 'Local pattern replacement within a small sliding window of target/IR: redundant load/store, algebraic identities, strength reduction.',
  },
  description: {
    zh: '窥孔优化（Peephole Optimization）在一段指令序列上滑动一个「小窗口」（通常 2~4 条），用一组预定义的模式替换规则把窗口内指令改成更优的等价序列。经典规则包括：LOAD r,x; STORE x,r → 去掉（冗余存取）；ADD r,0 → 去掉；MUL r,1 → 去掉；MUL r,2 → SHL r,1（强度削减）；LOAD r,x; LOAD r,x → 去掉一条。本实现用一个简单栈式 IR 并匹配若干模板，迭代直到窗口不再变化。它简单、稳健，常作为代码生成后的最后一道清理。',
    en: 'Peephole Optimization slides a small window (typically 2~4 instructions) over an instruction sequence and applies predefined pattern-replacement rules to rewrite the window into an equivalent, more efficient sequence. Classical rules include: LOAD r,x; STORE x,r → drop (redundant access); ADD r,0 → drop; MUL r,1 → drop; MUL r,2 → SHL r,1 (strength reduction); LOAD r,x; LOAD r,x → drop one. This implementation uses a simple stack IR, matches several templates, and iterates until stable. It is simple, robust, and commonly the last cleanup pass after code generation.',
  },
  tags: ['parsing', 'optimization', 'compiler', 'peephole'],
  complexity: { time: 'O(n·k)', space: 'O(n)' },
};
