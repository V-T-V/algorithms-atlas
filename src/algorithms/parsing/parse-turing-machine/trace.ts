import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildIncTm } from './impl.ts';

export const DEFAULT_INPUT = ['1', '0', '1', '1'];

export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `输入: ${input.join('')}`, en: `Input: ${input.join('')}` })
    .setAux([{ label: 'tape', value: input.join(''), role: 'compare' as BarRole }])
    .commit();
  const tm = buildIncTm({
    onStep: (st, head, tape) => {
      const lo = Math.min(head, 0);
      const hi = Math.max(head, ...tape.keys(), input.length - 1);
      const cells: string[] = [];
      for (let i = lo; i <= hi; i++) cells.push(tape.get(i) ?? '_');
      rec
        .begin({ zh: `状态 ${st}, 头 @${head}`, en: `state ${st}, head @${head}` })
        .setAux([
          { label: 'state', value: st, role: 'pivot' as BarRole },
          { label: 'tape', value: cells.join(' '), role: 'frontier' as BarRole },
          { label: 'head', value: String(head), role: 'compare' as BarRole },
        ])
        .commit();
    },
  });
  const r = tm.run(input);
  rec
    .begin({ zh: `停机, 步数=${r.steps}`, en: `halted, steps=${r.steps}` })
    .setAux([{ label: 'steps', value: String(r.steps), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
