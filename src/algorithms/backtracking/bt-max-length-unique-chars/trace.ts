// 最大唯一字符拼接 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btMaxLengthUniqueChars, type BtMaxLengthUniqueCharsHooks } from './impl.ts';

export const DEFAULT_INPUT = ['un', 'iq', 'ue'];

export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `从 [${input.map((s) => `"${s}"`).join(', ')}] 选最大唯一拼接`,
      en: `Pick from [${input.map((s) => `"${s}"`).join(', ')}] for max unique concat`,
    })
    .setBars(input.map((s) => ({ value: s.length, role: 'default' as BarRole })))
    .setAux([{ label: '候选数', value: String(input.length), role: 'pivot' }])
    .commit();

  const hooks: BtMaxLengthUniqueCharsHooks = {
    onTry: (index, _include, feasible) => {
      rec
        .begin({
          zh: `考察「${input[index]}」：${feasible ? '可加入' : '冲突/重复'}`,
          en: `Inspect "${input[index]}": ${feasible ? 'ok' : 'conflict/dup'}`,
        })
        .setBars(
          input.map((s, i) => ({
            value: s.length,
            role: (i === index ? (feasible ? 'compare' : 'warn') : 'default') as BarRole,
          })),
        )
        .commit();
    },
  };

  const result = btMaxLengthUniqueChars(input, hooks);

  rec
    .begin({ zh: `完成：最大长度 ${result}`, en: `Done: max length ${result}` })
    .setBars([{ value: result, role: 'final' as BarRole }])
    .setAux([{ label: '最大长度', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
