// 表达式加运算符 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btExpressionAdd2, type BtExpressionAdd2Hooks } from './impl.ts';

export const DEFAULT_INPUT = { num: '123', target: 6 };

export function buildTrace(input: { num: string; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { num, target } = input;
  const codes = Array.from(num).map((c) => Number(c));

  rec
    .begin({ zh: `数字「${num}」目标 ${target}`, en: `num "${num}" target ${target}` })
    .setBars(rec.barsFrom(codes))
    .setAux([{ label: '目标', value: `插入 +-× 等于 ${target}`, role: 'pivot' }])
    .commit();

  const hooks: BtExpressionAdd2Hooks = {
    onPick: (expr, value) => {
      rec
        .begin({ zh: `构造 ${expr} = ${value}`, en: `Build ${expr} = ${value}` })
        .setAux([
          { label: '表达式', value: expr, role: 'frontier' },
          { label: '当前值', value: String(value), role: 'compare' },
        ])
        .commit();
    },
    onEmit: (expr) => {
      rec
        .begin({ zh: `命中！${expr} = ${target}`, en: `Hit! ${expr} = ${target}` })
        .setAux([{ label: '解', value: expr, role: 'final' }])
        .commit();
    },
  };

  const result = btExpressionAdd2(num, target, hooks);

  rec
    .begin({ zh: `完成：共 ${result.length} 个解`, en: `Done: ${result.length} solutions` })
    .setAux([
      { label: '解数', value: String(result.length), role: 'final' },
      { label: '解', value: result.join(' , '), role: 'final' },
    ])
    .commit();

  return rec.build();
}
