import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { interpolationSearch3, type Interp3Hooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
export const DEFAULT_TARGET = 70;

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
  const hooks: Interp3Hooks = {
    onProbe: (i: number) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[i] = 'compare';
      rec
        .begin({ zh: `探测 a[${i}]=${values[i]}`, en: `探测 a[${i}]=${values[i]}` })
        .setArray(values, roles, [{ index: i, label: 'i' }])
        .commit();
    },
  };
  const result = interpolationSearch3(input, target, hooks);
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
