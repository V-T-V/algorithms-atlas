import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sentinelLinearSearch2, type LinearSentinel2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [9, 3, 7, 1, 5, 11, 13, 2, 8, 4];
export const DEFAULT_TARGET = 8;

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
  const hooks: LinearSentinel2Hooks = {
    onCompare: (i: number) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[i] = 'compare';
      rec
        .begin({ zh: `比较 a[${i}]=${values[i]}`, en: `比较 a[${i}]=${values[i]}` })
        .setArray(values, roles, [{ index: i, label: 'i' }])
        .commit();
    },
  };
  const result = sentinelLinearSearch2(input, target, hooks);
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
