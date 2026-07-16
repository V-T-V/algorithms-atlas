import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findDuplicate2, type Dup2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 4, 2, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `数组：[${input.join(',')}]（值当下标成链）`, en: `Array: [${input.join(',')}]` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: Dup2Hooks = {
    onStep: (pos) => {
      rec
        .begin({ zh: `指针到达位置 ${pos}`, en: `Pointer at ${pos}` })
        .setArray(input, undefined, [{ index: pos, label: 'p' }])
        .commit();
    },
  };
  const r = findDuplicate2(input, hooks);
  rec
    .begin({ zh: `重复数 = ${r}`, en: `Duplicate = ${r}` })
    .setAux([{ label: 'duplicate', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
