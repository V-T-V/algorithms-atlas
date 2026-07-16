import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { intersectSorted, type IntersectHooks } from './impl.ts';

export const DEFAULT_INPUT_A = [1, 2, 2, 3, 4, 6];
export const DEFAULT_INPUT_B = [2, 3, 5, 6];

export function buildTrace(a: number[] = DEFAULT_INPUT_A, b: number[] = DEFAULT_INPUT_B): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: `A=[${a.join(',')}] B=[${b.join(',')}]`,
      en: `A=[${a.join(',')}] B=[${b.join(',')}]`,
    })
    .setArray(a, undefined, [])
    .commit();
  const hooks: IntersectHooks = {
    onCompare: (i, j) => {
      const roles: BarRole[] = new Array(a.length).fill('default');
      roles[i] = 'compare';
      rec
        .begin({
          zh: `比较 A[${i}]=${a[i]} 与 B[${j}]=${b[j]}`,
          en: `Compare A[${i}]=${a[i]} vs B[${j}]=${b[j]}`,
        })
        .setArray(a, roles, [{ index: i, label: 'i' }])
        .setAux([{ label: 'B[j]', value: String(b[j]), role: 'pivot' as BarRole }])
        .commit();
    },
  };
  const r = intersectSorted(a, b, hooks);
  rec
    .begin({ zh: `交集 = [${r.join(',')}]`, en: `Intersection = [${r.join(',')}]` })
    .setAux([{ label: 'result', value: `[${r.join(',')}]`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
