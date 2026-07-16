// =============================================================================
// 分隔链表（双链变种）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, partitionAlt, type PartitionAltHooks } from './impl.ts';

export const DEFAULT_INPUT = { values: [1, 4, 3, 2, 5, 2], x: 3 };

export function buildTrace(input: { values: number[]; x: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, x } = input;
  const less: number[] = [];
  const geq: number[] = [];

  rec
    .begin({
      zh: `初始：${values.join(' → ')}，基准 x=${x}`,
      en: `Initial: ${values.join(' → ')}, x=${x}`,
    })
    .setAux([
      { label: 'x', value: String(x), role: 'pivot' },
      { label: 'less', value: '-', role: 'frontier' },
      { label: 'geq', value: '-', role: 'frontier' },
    ])
    .commit();

  const hooks: PartitionAltHooks = {
    onDispatch: (v, side) => {
      if (side === 'less') less.push(v);
      else geq.push(v);
      rec
        .begin({
          zh: `${v} → ${side === 'less' ? '< x' : '>= x'}`,
          en: `${v} → ${side === 'less' ? '< x' : '>= x'}`,
        })
        .setAux([
          { label: 'less', value: less.join(' → ') || '-', role: 'frontier' },
          { label: 'geq', value: geq.join(' → ') || '-', role: 'frontier' },
        ])
        .commit();
    },
  };

  const result = partitionAlt(buildList(values), x, hooks);
  const arr = listToArray(result);

  rec
    .begin({ zh: `结果：${arr.join(' → ')}`, en: `Result: ${arr.join(' → ')}` })
    .setAux([{ label: 'result', value: arr.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
