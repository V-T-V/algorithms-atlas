// =============================================================================
// 整数替换 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { integerReplacement, type IntReplHooks } from './impl.ts';

export const DEFAULT_INPUT = 8;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const steps: Array<{ cur: number; op: string; next: number }> = [];

  rec
    .begin({ zh: `把 ${input} 变成 1`, en: `Reduce ${input} to 1` })
    .setAux([{ label: '初始', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: IntReplHooks = {
    onStep: (cur, op, next) => steps.push({ cur, op, next }),
  };

  const total = integerReplacement(input, hooks);

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i]!;
    rec
      .begin({
        zh: `步骤 ${i + 1}: ${s.cur} --${s.op}--> ${s.next}`,
        en: `Step ${i + 1}: ${s.cur} --${s.op}--> ${s.next}`,
      })
      .setAux([
        { label: '当前', value: String(s.cur), role: 'compare' as BarRole },
        { label: '操作', value: s.op, role: 'pivot' as BarRole },
        { label: '结果', value: String(s.next), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({ zh: `完成：共 ${total} 步`, en: `Done: ${total} steps` })
    .setAux([{ label: '总步数', value: String(total), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
