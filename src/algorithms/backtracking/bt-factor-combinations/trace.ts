// 因数组合 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btFactorCombinations, type BtFactorCombinationsHooks } from './impl.ts';

export const DEFAULT_INPUT = 32;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const combo: number[] = [];
  let count = 0;

  rec
    .begin({ zh: `分解 ${input} 的因数组合`, en: `Factor combinations of ${input}` })
    .setAux([{ label: 'n', value: String(input), role: 'pivot' }])
    .commit();

  const hooks: BtFactorCombinationsHooks = {
    onCombo: (c) => {
      count++;
      rec
        .begin({
          zh: `组合：[${c.join('×')}] = ${input}`,
          en: `Combo: [${c.join('×')}] = ${input}`,
        })
        .setBars(c.map((v) => ({ value: v, role: 'final' as BarRole })))
        .setAux([
          { label: 'product', value: String(c.reduce((a, b) => a * b, 1)), role: 'final' },
          { label: 'count', value: String(count), role: 'final' },
        ])
        .commit();
    },
    onPick: (f) => {
      combo.push(f);
      rec
        .begin({ zh: `选因数 ${f}`, en: `Pick factor ${f}` })
        .setBars(combo.map((v) => ({ value: v, role: 'compare' as BarRole })))
        .setAux([{ label: 'cur', value: combo.join('×'), role: 'pivot' }])
        .commit();
      combo.pop();
    },
  };

  const result = btFactorCombinations(input, hooks);

  rec
    .begin({ zh: `完成：${result.length} 组`, en: `Done: ${result.length} combos` })
    .setAux([{ label: '总数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
