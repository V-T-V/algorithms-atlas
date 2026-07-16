import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildMooreSeq } from './impl.ts';

export const DEFAULT_INPUT = ['1', '1', '0', '1', '1'];

export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `输入: ${input.join('')}`, en: `Input: ${input.join('')}` }).commit();
  const out = buildMooreSeq({
    onState: (s, o) =>
      rec
        .begin({ zh: `状态 ${s} / 出 ${o}`, en: `state ${s} / out ${o}` })
        .setAux([
          { label: 'state', value: s, role: 'pivot' as BarRole },
          { label: 'out', value: o, role: (o === '1' ? 'final' : 'default') as BarRole },
        ])
        .commit(),
  }).run(input);
  rec
    .begin({ zh: `输出: ${out.join('')}`, en: `Output: ${out.join('')}` })
    .setAux([{ label: 'output', value: out.join(''), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
