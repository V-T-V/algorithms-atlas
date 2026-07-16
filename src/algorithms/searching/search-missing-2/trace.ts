import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { missingNumber2, type Missing2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 0, 1];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `数组：[${input.join(',')}]（0..n 缺一）`, en: `Array: [${input.join(',')}]` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: Missing2Hooks = {
    onSum: (i, sum) => {
      const roles: BarRole[] = new Array(input.length).fill('default');
      roles[i] = 'compare';
      rec
        .begin({ zh: `累加 a[${i}]，当前和 = ${sum}`, en: `Add a[${i}], sum = ${sum}` })
        .setArray(input, roles, [{ index: i, label: 'i' }])
        .commit();
    },
  };
  const r = missingNumber2(input, hooks);
  rec
    .begin({ zh: `缺失数字 = ${r}`, en: `Missing = ${r}` })
    .setAux([{ label: 'missing', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
