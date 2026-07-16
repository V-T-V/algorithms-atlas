// 花括号展开 II · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btBraceExpansion2, type BtBraceExpansion2Hooks } from './impl.ts';

export const DEFAULT_INPUT = '{a,b}{c,{d,e}}';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `展开「${input}」`, en: `Expand "${input}"` })
    .setAux([{ label: 'expr', value: input, role: 'pivot' }])
    .commit();

  const hooks: BtBraceExpansion2Hooks = {
    onResult: (results) => {
      rec
        .begin({
          zh: `结果：[${results.join(', ')}]`,
          en: `Results: [${results.join(', ')}]`,
        })
        .setBars(results.map((r) => ({ value: r.length, role: 'final' as BarRole })))
        .setAux([
          { label: 'count', value: String(results.length), role: 'final' },
          { label: 'list', value: results.join(' | '), role: 'final' },
        ])
        .commit();
    },
  };

  const result = btBraceExpansion2(input, hooks);

  rec
    .begin({ zh: `完成：${result.length} 个字符串`, en: `Done: ${result.length} strings` })
    .setAux([{ label: '总数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
