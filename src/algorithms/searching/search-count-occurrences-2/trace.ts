import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countOccurrences2, type CountOcc2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 2, 2, 3, 4, 5, 5, 5, 5, 6];
export const DEFAULT_TARGET = 5;

export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `统计 ${target} 的出现次数`, en: `Count occurrences of ${target}` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: CountOcc2Hooks = {
    onBound: (which, idx) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[idx] = 'compare';
      rec
        .begin({
          zh: `${which === 'lower' ? '下界' : '上界'}: 下标 ${idx}`,
          en: `${which}: index ${idx}`,
        })
        .setArray(input, roles, [{ index: idx, label: which === 'lower' ? 'L' : 'U' }])
        .commit();
    },
  };
  const count = countOccurrences2(input, target, hooks);
  rec
    .begin({ zh: `出现次数 = ${count}`, en: `Count = ${count}` })
    .setAux([{ label: 'count', value: String(count), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
