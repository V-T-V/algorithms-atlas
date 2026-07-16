// =============================================================================
// 错排数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { derangement, type DerangementHooks } from './impl.ts';

export const DEFAULT_INPUT = 6;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const seq: Array<{ k: number; v: number }> = [];
  let result = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        seq.map(({ k, v }) => ({
          value: v,
          role: (k === n ? 'final' : 'frontier') as BarRole,
          label: `D(${k})=${v}`,
        })),
      )
      .setAux([
        { label: '递推', value: 'D(k)=(k-1)(D(k-1)+D(k-2))', role: 'default' },
        { label: `D(${n})`, value: String(result), role: 'final' },
      ])
      .commit();
  };

  snap({ zh: `计算 D(${n})`, en: `Compute D(${n})` });

  const hooks: DerangementHooks = {
    onStep: (k, val) => {
      seq.push({ k, v: val });
      snap({ zh: `D(${k}) = ${val}`, en: `D(${k}) = ${val}` });
    },
    onResult: (val) => {
      result = val;
      snap({ zh: `D(${n}) = ${val}`, en: `D(${n}) = ${val}` });
    },
  };

  derangement(n, hooks);

  rec
    .begin({ zh: `完成：D(${n}) = ${result}`, en: `Done: D(${n}) = ${result}` })
    .setBars(
      seq.map(({ k, v }) => ({
        value: v,
        role: (k === n ? 'final' : 'default') as BarRole,
        label: `D(${k})`,
      })),
    )
    .setAux([{ label: '答案', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
