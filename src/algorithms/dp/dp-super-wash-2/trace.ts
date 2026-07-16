// =============================================================================
// 超级洗衣机 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMinSteps, type SuperWashHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 0, 5];

export function buildTrace(machines: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sum = machines.reduce((a, b) => a + b, 0);
  const avg = sum % machines.length === 0 ? sum / machines.length : -1;
  let ci = -1;
  let flow = 0;
  let best = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        machines.map((v, i) => ({ value: v, role: (i === ci ? 'compare' : 'default') as BarRole })),
      )
      .setAux([
        { label: 'avg', value: String(avg), role: 'frontier' },
        { label: 'flow', value: String(flow), role: 'pivot' },
        { label: 'best', value: String(best), role: 'final' },
      ])
      .commit();
  };

  snap({ zh: `machines=[${machines.join(',')}]`, en: `machines=[${machines.join(',')}]` });

  const hooks: SuperWashHooks = {
    onStep: (i, _m, f, b) => {
      ci = i;
      flow = f;
      best = b;
      snap({ zh: `i=${i} flow=${f} best=${b}`, en: `i=${i} flow=${f} best=${b}` });
    },
  };

  const ans = findMinSteps(machines, hooks);

  rec
    .begin({
      zh: ans === -1 ? '无法均分' : `最少轮数=${ans}`,
      en: ans === -1 ? 'impossible' : `min steps=${ans}`,
    })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
