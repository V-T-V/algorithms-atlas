import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countInRange, type CountRangeHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const DEFAULT_LO = 3;
export const DEFAULT_HI = 7;

export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  loVal: number = DEFAULT_LO,
  hiVal: number = DEFAULT_HI,
): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const inRange = (v: number): boolean => v >= loVal && v <= hiVal;
  rec
    .begin({
      zh: `统计值在 [${loVal}, ${hiVal}] 内的元素数`,
      en: `Count values in [${loVal}, ${hiVal}]`,
    })
    .setArray(
      input,
      input.map((v) => (inRange(v) ? 'frontier' : 'default') as BarRole),
      [],
    )
    .commit();
  const hooks: CountRangeHooks = {
    onBound: (idx) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[idx] = 'compare';
      rec
        .begin({ zh: `边界下标 = ${idx}`, en: `Bound index = ${idx}` })
        .setArray(input, roles, [{ index: idx, label: 'b' }])
        .commit();
    },
  };
  const r = countInRange(input, loVal, hiVal, hooks);
  rec
    .begin({ zh: `区间内元素数 = ${r}`, en: `Count in range = ${r}` })
    .setAux([{ label: 'count', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
