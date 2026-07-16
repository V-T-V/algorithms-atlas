// =============================================================================
// 窥孔优化 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { peephole, instrStr, type Instr, type PeepholeHooks } from './impl.ts';

export const DEFAULT_INPUT: Instr[] = [
  { op: 'LOAD', dst: 'r1', src1: 'x' },
  { op: 'STORE', dst: 'x', src1: 'r1' }, // 冗余 LOAD/STORE
  { op: 'LOAD', dst: 'r2', src1: 'y' },
  { op: 'ADD', dst: 'r2', src1: 'r2', src2: '0' }, // +0
  { op: 'MUL', dst: 'r2', src1: 'r2', src2: '2' }, // *2 → SHL
  { op: 'MUL', dst: 'r3', src1: 'r3', src2: '1' }, // *1
];

export function buildTrace(input: Instr[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `指令序列 ${input.length} 条。滑动窗口窥孔优化。`,
      en: `Instruction sequence ${input.length} long. Sliding-window peephole optimization.`,
    })
    .setAux([
      { label: 'IR', value: input.map(instrStr).join('\n'), role: 'frontier' as BarRole },
      { label: '指令数', value: String(input.length), role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: PeepholeHooks = {
    onRewrite: (window, replacement, at) => {
      rec
        .begin({
          zh: `@${at}：[${window.map(instrStr).join(' ; ')}] → [${replacement.map(instrStr).join(' ; ') || '∅'}]`,
          en: `@${at}: [${window.map(instrStr).join(' ; ')}] → [${replacement.map(instrStr).join(' ; ') || '∅'}]`,
        })
        .setAux([
          { label: '窗口', value: window.map(instrStr).join(' ; '), role: 'compare' as BarRole },
          {
            label: '替换为',
            value: replacement.map(instrStr).join(' ; ') || '∅',
            role: 'final' as BarRole,
          },
        ])
        .commit();
    },
    onPass: (pass, rewritesThisPass) => {
      rec
        .begin({
          zh: `第 ${pass} 轮：重写 ${rewritesThisPass} 处。`,
          en: `Pass ${pass}: ${rewritesThisPass} rewrites.`,
        })
        .setAux([
          { label: '轮次', value: String(pass), role: 'pivot' as BarRole },
          { label: '本轮重写', value: String(rewritesThisPass), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  const result = peephole(input, 20, hooks);

  rec
    .begin({
      zh: `完成：${input.length} → ${result.instrs.length} 条，重写 ${result.rewrites} 次，${result.passes} 轮。`,
      en: `Done: ${input.length} → ${result.instrs.length} instrs, ${result.rewrites} rewrites, ${result.passes} passes.`,
    })
    .setAux([
      { label: '原指令数', value: String(input.length), role: 'compare' as BarRole },
      { label: '现指令数', value: String(result.instrs.length), role: 'final' as BarRole },
      { label: '重写次数', value: String(result.rewrites), role: 'frontier' as BarRole },
      {
        label: '精简 IR',
        value: result.instrs.map(instrStr).join('\n'),
        role: 'default' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
