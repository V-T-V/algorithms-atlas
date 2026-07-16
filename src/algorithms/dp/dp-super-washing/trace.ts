// =============================================================================
// 超级洗衣机 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { superWashingMachines, type SuperWashHooks } from './impl.ts';

export const DEFAULT_MACHINES = [1, 0, 5];

export function buildTrace(machines: readonly number[] = DEFAULT_MACHINES): Frame[] {
  const rec = new TraceRecorder();
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }, gain?: number, flow?: number): void => {
    const roles: BarRole[] = machines.map((_, i) => (i === cur ? 'pivot' : 'default'));
    rec
      .begin(note)
      .setArray([...machines], roles, [{ index: cur < 0 ? 0 : cur, label: 'i' }])
      .setAux([
        { label: 'gain', value: gain === undefined ? '-' : String(gain), role: 'compare' },
        { label: 'flow', value: flow === undefined ? '-' : String(flow), role: 'swap' },
        { label: 'ans', value: String(ans), role: 'final' },
      ])
      .commit();
  };

  snap({ zh: `machines=[${machines.join(',')}]`, en: `machines=[${machines.join(',')}]` });

  const hooks: SuperWashHooks = {
    onStep: (i, g, f, mx) => {
      cur = i;
      ans = mx;
      snap(
        {
          zh: `i=${i}: gain=${g} flow=${f} ans=${mx}`,
          en: `i=${i}: gain=${g} flow=${f} ans=${mx}`,
        },
        g,
        f,
      );
    },
    onDone: (r) => {
      ans = r;
      cur = -1;
      snap({ zh: r < 0 ? '无解' : `最少轮数=${r}`, en: r < 0 ? 'no solution' : `rounds=${r}` });
    },
  };

  superWashingMachines(machines, hooks);

  rec
    .begin({ zh: ans < 0 ? '无解' : `完成：${ans}`, en: ans < 0 ? 'No solution' : `Done: ${ans}` })
    .setBars(machines.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '轮数', value: ans < 0 ? '-1' : String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
