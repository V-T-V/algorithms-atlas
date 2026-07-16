import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMinMoves, type SuperWashHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 0, 5];

export function buildTrace(machines: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let balance = 0;
  const sum = machines.reduce((a, b) => a + b, 0);
  const target = machines.length ? sum / machines.length : 0;
  rec
    .begin({ zh: `target=${target}`, en: `target=${target}` })
    .setBars(machines.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  const hooks: SuperWashHooks = {
    onMachine: (i, gain, ans) => {
      balance = gain;
      rec
        .begin({
          zh: `第${i}台 balance=${balance} 当前ans=${ans}`,
          en: `#${i} balance=${balance} ans=${ans}`,
        })
        .setBars(
          machines.map((v, j) => ({
            value: v,
            role: (j === i ? 'compare' : 'default') as BarRole,
          })),
        )
        .setAux([{ label: 'balance', value: String(balance), role: 'frontier' }])
        .commit();
    },
  };
  const ans = findMinMoves(machines, hooks);
  rec
    .begin({ zh: `最少步数=${ans}`, en: `Min steps=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
