// =============================================================================
// Catalan · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { catalanList, type CatalanHooks } from './impl.ts';

export const DEFAULT_INPUT = 8;

export function buildTrace(maxN: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const values: bigint[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(values.map((v) => ({ value: Number(v), role: 'frontier' })))
      .setAux(values.map((v, i) => ({ label: `C${i}`, value: v.toString(), role: 'final' })))
      .commit();
  };

  snap({ zh: `计算 C0..C${maxN}`, en: `Compute C0..C${maxN}` });

  const hooks: CatalanHooks = {
    onValue: (n, v) => {
      values.push(v);
      snap({ zh: `C${n} = ${v}`, en: `C${n} = ${v}` });
    },
  };

  catalanList(maxN, hooks);

  rec
    .begin({ zh: `共 ${values.length} 项`, en: `${values.length} terms` })
    .setAux([
      { label: `C${maxN}`, value: values[values.length - 1]?.toString() ?? '-', role: 'final' },
    ])
    .commit();

  return rec.build();
}
