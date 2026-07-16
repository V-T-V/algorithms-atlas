import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binarySearchIter, type BinIterHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
export const DEFAULT_TARGET = 15;

export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  rec
    .begin({ zh: `在升序数组中查找 ${target}`, en: `Search ${target} in sorted array` })
    .setArray(values, undefined, [])
    .commit();
  const hooks: BinIterHooks = {
    onCompare: (i: number) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[i] = 'compare';
      rec
        .begin({ zh: `比较 a[${i}]=${values[i]}`, en: `比较 a[${i}]=${values[i]}` })
        .setArray(values, roles, [{ index: i, label: 'i' }])
        .commit();
    },
  };
  const result = binarySearchIter(input, target, hooks);
  const roles: BarRole[] = new Array(n).fill('default');
  if (result >= 0) roles[result] = 'final';
  rec
    .begin(
      result >= 0
        ? { zh: `命中下标 ${result}`, en: `Found at ${result}` }
        : { zh: `未找到`, en: `Not found` },
    )
    .setArray(values, roles, result >= 0 ? [{ index: result, label: '✓' }] : [])
    .commit();
  return rec.build();
}
