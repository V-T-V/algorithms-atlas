// =============================================================================
// 反转区间链表 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, reverseRange, type ReverseRangeHooks } from './impl.ts';

export const DEFAULT_INPUT = { values: [1, 2, 3, 4, 5], left: 2, right: 4 };

export function buildTrace(
  input: { values: number[]; left: number; right: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { values, left, right } = input;

  rec
    .begin({
      zh: `初始：${values.join(' → ')}，反转 [${left}, ${right}]`,
      en: `Initial: ${values.join(' → ')}, reverse [${left}, ${right}]`,
    })
    .setAux([
      { label: 'left', value: String(left), role: 'pivot' },
      { label: 'right', value: String(right), role: 'pivot' },
    ])
    .commit();

  let moves = 0;
  const hooks: ReverseRangeHooks = {
    onAnchor: (v) => {
      rec
        .begin({
          zh: `锚点前驱：${Number.isNaN(v) ? 'dummy' : v}`,
          en: `Anchor prev: ${Number.isNaN(v) ? 'dummy' : v}`,
        })
        .setAux([
          { label: 'anchor', value: Number.isNaN(v) ? 'dummy' : String(v), role: 'compare' },
        ])
        .commit();
    },
    onMove: (v) => {
      moves++;
      rec
        .begin({ zh: `头插 ${v}（第 ${moves} 步）`, en: `Head-insert ${v} (step ${moves})` })
        .setAux([{ label: 'moved', value: String(v), role: 'swap' }])
        .commit();
    },
  };

  const result = reverseRange(buildList(values), left, right, hooks);
  const arr = listToArray(result);

  rec
    .begin({ zh: `结果：${arr.join(' → ')}`, en: `Result: ${arr.join(' → ')}` })
    .setAux([{ label: 'result', value: arr.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
