// 字符串拼接最小表示 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyPatchString, type GreedyPatchStringHooks } from './impl.ts';

export const DEFAULT_INPUT = ['b', 'ba', 'a'];

export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `片段 [${input.map((s) => `"${s}"`).join(', ')}]`,
      en: `parts [${input.map((s) => `"${s}"`).join(', ')}]`,
    })
    .setBars(input.map((s) => ({ value: s.length, role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyPatchStringHooks = {
    onSort: (sorted) => {
      rec
        .begin({ zh: `排序后 [${sorted.join(', ')}]`, en: `Sorted [${sorted.join(', ')}]` })
        .setBars(sorted.map((s) => ({ value: s.length, role: 'pivot' as BarRole })))
        .commit();
    },
  };

  const result = greedyPatchString(input, hooks);

  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setAux([{ label: '结果', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
