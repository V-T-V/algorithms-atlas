import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { searchRange2, type Range2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 7, 7, 8, 8, 10];
export const DEFAULT_TARGET = 8;

export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({
      zh: `查找 ${target} 的首次与最后一次出现`,
      en: `Find first and last position of ${target}`,
    })
    .setArray(input, undefined, [])
    .commit();
  const hooks: Range2Hooks = {
    onFind: (which, idx) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[idx] = 'final';
      rec
        .begin({
          zh: `${which === 'first' ? '首次' : '最后一次'}: 下标 ${idx}`,
          en: `${which}: index ${idx}`,
        })
        .setArray(input, roles, [{ index: idx, label: which === 'first' ? 'L' : 'R' }])
        .commit();
    },
  };
  const [first, last] = searchRange2(input, target, hooks);
  rec
    .begin(
      first >= 0
        ? { zh: `范围 [${first}, ${last}]`, en: `Range [${first}, ${last}]` }
        : { zh: `未找到`, en: `Not found` },
    )
    .setArray(
      input,
      undefined,
      first >= 0
        ? [
            { index: first, label: 'L' },
            { index: last, label: 'R' },
          ]
        : [],
    )
    .commit();
  return rec.build();
}
