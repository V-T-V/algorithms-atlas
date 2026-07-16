import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twoSumSorted, type PairSumHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 7, 11, 15, 20, 25];
export const DEFAULT_TARGET = 22;

export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `在升序数组中找和为 ${target} 的一对`, en: `Find pair summing to ${target}` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: PairSumHooks = {
    onCompare: (lo, hi) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[lo] = 'compare';
      roles[hi] = 'pivot';
      rec
        .begin({
          zh: `a[${lo}]+a[${hi}]=${input[lo]! + input[hi]!}`,
          en: `a[${lo}]+a[${hi}]=${input[lo]! + input[hi]!}`,
        })
        .setArray(input, roles, [
          { index: lo, label: 'lo' },
          { index: hi, label: 'hi' },
        ])
        .commit();
    },
  };
  const [lo, hi] = twoSumSorted(input, target, hooks);
  const hit = lo >= 0;
  const roles: BarRole[] = new Array(n).fill('default');
  if (hit) {
    roles[lo] = 'final';
    roles[hi] = 'final';
  }
  rec
    .begin(
      hit
        ? { zh: `命中：a[${lo}]+a[${hi}]=${target}`, en: `Found: a[${lo}]+a[${hi}]=${target}` }
        : { zh: `未找到`, en: `Not found` },
    )
    .setArray(
      input,
      roles,
      hit
        ? [
            { index: lo, label: 'L' },
            { index: hi, label: 'R' },
          ]
        : [],
    )
    .commit();
  return rec.build();
}
