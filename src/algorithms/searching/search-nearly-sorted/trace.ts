import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { searchNearlySorted, type NearlySortedHooks } from './impl.ts';

export const DEFAULT_INPUT = [6, 3, 7, 1, 5, 2, 8, 4];
export const DEFAULT_TARGET = 8;
export const DEFAULT_K = 2;

export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
  k: number = DEFAULT_K,
): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({
      zh: `在近似有序数组（k=${k}）中查找 ${target}`,
      en: `Search ${target} in nearly-sorted (k=${k}) array`,
    })
    .setArray(input, undefined, [])
    .commit();
  const hooks: NearlySortedHooks = {
    onCheck: (i) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[i] = 'compare';
      rec
        .begin({ zh: `检查 a[${i}]=${input[i]}`, en: `Check a[${i}]=${input[i]}` })
        .setArray(input, roles, [{ index: i, label: 'i' }])
        .commit();
    },
  };
  const result = searchNearlySorted(input, target, k, hooks);
  const roles: BarRole[] = new Array(n).fill('default');
  if (result >= 0) roles[result] = 'final';
  rec
    .begin(
      result >= 0
        ? { zh: `命中下标 ${result}`, en: `Found at ${result}` }
        : { zh: `未找到`, en: `Not found` },
    )
    .setArray(input, roles, result >= 0 ? [{ index: result, label: 'V' }] : [])
    .commit();
  return rec.build();
}
