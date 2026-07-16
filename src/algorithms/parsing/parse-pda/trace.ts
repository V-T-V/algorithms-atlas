import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildAnBnPda } from './impl.ts';

export const DEFAULT_INPUT = ['a', 'a', 'b', 'b'];

export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `输入: ${input.join('')}`, en: `Input: ${input.join('')}` })
    .setAux([{ label: 'input', value: input.join(''), role: 'compare' as BarRole }])
    .commit();
  const pda = buildAnBnPda({
    onStep: (st, stack, sym) =>
      rec
        .begin({
          zh: `状态 ${st} | 栈 ${stack.join('/')}`,
          en: `state ${st} | stack ${stack.join('/')}`,
        })
        .setAux([
          { label: 'state', value: st, role: 'pivot' as BarRole },
          { label: 'stack', value: stack.join('/'), role: 'frontier' as BarRole },
          { label: 'next', value: sym ?? 'ε', role: 'compare' as BarRole },
        ])
        .commit(),
  });
  const ok = pda.run(input);
  rec
    .begin({ zh: ok ? '接受' : '拒绝', en: ok ? 'accept' : 'reject' })
    .setAux([{ label: 'result', value: ok ? 'accept' : 'reject', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
