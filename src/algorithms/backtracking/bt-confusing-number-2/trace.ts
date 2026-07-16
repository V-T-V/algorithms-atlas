// 困惑数 II · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btConfusingNumber2, type BtConfusingNumber2Hooks } from './impl.ts';

export const DEFAULT_INPUT = 100;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const found: number[] = [];

  rec
    .begin({ zh: `统计 [1,${input}] 中困惑数`, en: `Confusing numbers in [1,${input}]` })
    .setAux([{ label: 'n', value: String(input), role: 'pivot' }])
    .commit();

  const hooks: BtConfusingNumber2Hooks = {
    onConfusing: (value) => {
      found.push(value);
      rec
        .begin({ zh: `困惑数：${value}`, en: `Confusing: ${value}` })
        .setBars([{ value, role: 'final' as BarRole }])
        .setAux([
          { label: 'found', value: found.join(', '), role: 'final' },
          { label: 'count', value: String(found.length), role: 'pivot' },
        ])
        .commit();
    },
  };

  const total = btConfusingNumber2(input, hooks);

  rec
    .begin({ zh: `完成：共 ${total} 个`, en: `Done: ${total} total` })
    .setAux([
      { label: '总数', value: String(total), role: 'final' },
      { label: '列表', value: found.join(', '), role: 'final' },
    ])
    .commit();

  return rec.build();
}
