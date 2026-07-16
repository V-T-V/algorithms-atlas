// =============================================================================
// 链表右旋（成环变种）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, rotateRight2, type RotateRightHooks } from './impl.ts';

export const DEFAULT_INPUT = { values: [1, 2, 3, 4, 5], k: 2 };

export function buildTrace(input: { values: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, k } = input;

  rec
    .begin({
      zh: `原链表：${values.join(' → ')}，右旋 ${k}`,
      en: `List: ${values.join(' → ')}, rotate right by ${k}`,
    })
    .setAux([
      { label: 'n', value: String(values.length) },
      { label: 'k', value: String(k), role: 'pivot' },
    ])
    .commit();

  const hooks: RotateRightHooks = {
    onCloseRing: (len) => {
      rec
        .begin({ zh: `连成环（长度 ${len}）`, en: `Closed into ring (length ${len})` })
        .setAux([{ label: 'len', value: String(len), role: 'frontier' }])
        .commit();
    },
    onCut: (newHeadValue, cutValue) => {
      rec
        .begin({
          zh: `断开：${cutValue} → null，新头 ${newHeadValue}`,
          en: `Cut: ${cutValue} → null, new head ${newHeadValue}`,
        })
        .setAux([
          { label: 'newHead', value: String(newHeadValue), role: 'compare' },
          { label: 'cutAfter', value: String(cutValue), role: 'swap' },
        ])
        .commit();
    },
  };

  const newHead = rotateRight2(buildList(values), k, hooks);
  const result = listToArray(newHead);

  rec
    .begin({ zh: `结果：${result.join(' → ')}`, en: `Result: ${result.join(' → ')}` })
    .setAux([{ label: 'result', value: result.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
