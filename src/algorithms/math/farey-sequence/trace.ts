// =============================================================================
// 法里数列 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fareySequence, type FareyHooks } from './impl.ts';

export const DEFAULT_INPUT = 5;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const seq: Array<[number, number]> = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setMap(
        seq.map(([a, b], i) => ({
          key: `#${i}`,
          value: `${a}/${b}`,
          role: (i === seq.length - 1 ? 'compare' : 'frontier') as BarRole,
        })),
      )
      .setAux([{ label: '项数', value: String(seq.length), role: 'final' }])
      .commit();
  };

  snap({ zh: `生成 F_${n}`, en: `Generate F_${n}` });

  const hooks: FareyHooks = {
    onTerm: (a, b) => {
      seq.push([a, b]);
      snap({ zh: `加入 ${a}/${b}`, en: `Add ${a}/${b}` });
    },
    onResult: (s) => {
      snap({ zh: `共 ${s.length} 项`, en: `${s.length} terms` });
    },
  };

  fareySequence(n, hooks);

  rec
    .begin({ zh: `完成：F_${n} 共 ${seq.length} 项`, en: `Done: F_${n} has ${seq.length} terms` })
    .setMap(seq.map(([a, b]) => ({ key: `${a}/${b}`, value: '', role: 'final' as BarRole })))
    .setAux([{ label: '项数', value: String(seq.length), role: 'final' }])
    .commit();

  return rec.build();
}
