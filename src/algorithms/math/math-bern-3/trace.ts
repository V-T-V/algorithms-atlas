// =============================================================================
// Bernoulli · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bernoulliTable, type BernoulliHooks, type Rational } from './impl.ts';

export const DEFAULT_INPUT = 8;

function fmt(r: Rational): string {
  return r.den === 1n ? r.num.toString() : `${r.num}/${r.den}`;
}

export function buildTrace(maxM: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const values: Rational[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        values.map((v) => ({ value: Number(v.num) / Number(v.den || 1n), role: 'frontier' })),
      )
      .setAux(values.map((v, i) => ({ label: `B${i}`, value: fmt(v), role: 'final' })))
      .commit();
  };

  snap({ zh: `计算 B0..B${maxM}`, en: `Compute B0..B${maxM}` });

  const hooks: BernoulliHooks = {
    onValue: (m, v) => {
      values.push(v);
      snap({ zh: `B${m} = ${fmt(v)}`, en: `B${m} = ${fmt(v)}` });
    },
  };

  bernoulliTable(maxM, hooks);

  rec
    .begin({ zh: `共 ${values.length} 项`, en: `${values.length} terms` })
    .setAux([{ label: `B${maxM}`, value: fmt(values[values.length - 1]!), role: 'final' }])
    .commit();

  return rec.build();
}
