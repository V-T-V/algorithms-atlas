// 字母大小写全排列 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btLetterCasePermute, type BtLetterCasePermuteHooks } from './impl.ts';

export const DEFAULT_INPUT = 'a1b2';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const codes = Array.from(input).map((c) => c.charCodeAt(0));
  let count = 0;

  rec
    .begin({ zh: `生成「${input}」的大小写全排列`, en: `Case permutations of "${input}"` })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [],
    )
    .commit();

  const hooks: BtLetterCasePermuteHooks = {
    onResult: (out) => {
      count++;
      rec
        .begin({ zh: `结果：${out}`, en: `Result: ${out}` })
        .setBars(Array.from(out).map((c) => ({ value: c.charCodeAt(0), role: 'final' as BarRole })))
        .setAux([
          { label: 'result', value: out, role: 'final' },
          { label: 'count', value: String(count), role: 'pivot' },
        ])
        .commit();
    },
  };

  const result = btLetterCasePermute(input, hooks);

  rec
    .begin({ zh: `完成：${result.length} 个`, en: `Done: ${result.length} results` })
    .setAux([{ label: '总数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
