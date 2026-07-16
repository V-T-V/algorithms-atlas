// =============================================================================
// 递减数字分割串 · 录制帧序列
// 可视化：setBars 渲染当前序列；setAux 展示生成过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { splitStringDesc, type SplitStringDescHooks } from './impl.ts';

export const DEFAULT_INPUT = '11235813';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const seq: number[] = [];

  rec
    .begin({
      zh: `把 "${input}" 拆成斐波那契式序列（每段=前两段和）`,
      en: `Split "${input}" into Fibonacci-like sequence`,
    })
    .setBars([{ value: 0, role: 'default' }])
    .setAux([{ label: 'num', value: input, role: 'default' }])
    .commit();

  const hooks: SplitStringDescHooks = {
    onTryFirstTwo: (first, second) => {
      seq.length = 0;
      seq.push(first, second);
      rec
        .begin({
          zh: `尝试前两项：${first}, ${second}`,
          en: `Try first two: ${first}, ${second}`,
        })
        .setBars(seq.map((v) => ({ value: v, role: 'pivot' as BarRole })))
        .setAux([
          { label: '第一项', value: String(first), role: 'pivot' },
          { label: '第二项', value: String(second), role: 'pivot' },
        ])
        .commit();
    },
    onGenerate: (next, built) => {
      seq.length = 0;
      seq.push(...built);
      rec
        .begin({
          zh: `生成下一项：${built[built.length - 3]} + ${built[built.length - 2]} = ${next}`,
          en: `Generate next: ${built[built.length - 3]} + ${built[built.length - 2]} = ${next}`,
        })
        .setBars(seq.map((v) => ({ value: v, role: 'compare' as BarRole })))
        .setAux([{ label: '已生成', value: seq.join(', '), role: 'final' }])
        .commit();
    },
  };

  const result = splitStringDesc(input, hooks);

  rec
    .begin({
      zh: result.found ? `完成：[${result.sequence.join(', ')}]` : `无可行拆分`,
      en: result.found ? `Done: [${result.sequence.join(', ')}]` : `No valid split`,
    })
    .setBars(
      result.found
        ? result.sequence.map((v) => ({ value: v, role: 'final' as BarRole }))
        : [{ value: 0, role: 'warn' as BarRole }],
    )
    .setAux([
      {
        label: '结果',
        value: result.found ? result.sequence.join(', ') : '(空)',
        role: result.found ? 'final' : ('warn' as BarRole),
      },
    ])
    .commit();

  return rec.build();
}
