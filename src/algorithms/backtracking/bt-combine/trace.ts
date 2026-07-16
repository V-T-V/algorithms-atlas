// 组合 C(n,k) · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btCombine, type BtCombineHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 4, k: 2 };

export function buildTrace(input: { n: number; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, k } = input;
  let count = 0;

  rec
    .begin({ zh: `从 1..${n} 选 ${k} 个`, en: `Choose ${k} from 1..${n}` })
    .setBars([])
    .setAux([{ label: 'combo', value: '∅', role: 'default' }])
    .commit();

  const hooks: BtCombineHooks = {
    onCombo: (c) => {
      count++;
      rec
        .begin({ zh: `组合：[${c.join(', ')}]`, en: `Combo: [${c.join(', ')}]` })
        .setBars(c.map((v) => ({ value: v, role: 'final' as BarRole })))
        .setAux([
          { label: 'combo', value: c.join(', '), role: 'pivot' },
          { label: 'count', value: String(count), role: 'final' },
        ])
        .commit();
    },
  };

  const result = btCombine(n, k, hooks);

  rec
    .begin({
      zh: `完成：C(${n},${k}) = ${result.length}`,
      en: `Done: C(${n},${k}) = ${result.length}`,
    })
    .setBars([{ value: result.length, role: 'final' as BarRole }])
    .setAux([{ label: '总数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
