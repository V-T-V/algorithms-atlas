import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pairWithDifference, type PairDiffHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 8, 12, 15];
export const DEFAULT_TARGET = 7;

export function buildTrace(input: number[] = DEFAULT_INPUT, d: number = DEFAULT_TARGET): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `找差为 ${d} 的一对`, en: `Find pair with difference ${d}` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: PairDiffHooks = {
    onCompare: (i, j) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[i] = 'compare';
      roles[j] = 'pivot';
      rec
        .begin({
          zh: `a[${j}]-a[${i}]=${input[j]! - input[i]!}`,
          en: `a[${j}]-a[${i}]=${input[j]! - input[i]!}`,
        })
        .setArray(input, roles, [
          { index: i, label: 'i' },
          { index: j, label: 'j' },
        ])
        .commit();
    },
  };
  const [i, j] = pairWithDifference(input, d, hooks);
  const hit = i >= 0;
  const roles: BarRole[] = new Array(n).fill('default');
  if (hit) {
    roles[i] = 'final';
    roles[j] = 'final';
  }
  rec
    .begin(
      hit
        ? { zh: `命中：a[${j}]-a[${i}]=${d}`, en: `Found: a[${j}]-a[${i}]=${d}` }
        : { zh: `未找到`, en: `Not found` },
    )
    .setArray(
      input,
      roles,
      hit
        ? [
            { index: i, label: 'i' },
            { index: j, label: 'j' },
          ]
        : [],
    )
    .commit();
  return rec.build();
}
