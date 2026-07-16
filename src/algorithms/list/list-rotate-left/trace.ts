// =============================================================================
// 链表左旋 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, rotateLeft, type RotateLeftHooks } from './impl.ts';

export const DEFAULT_INPUT = { values: [1, 2, 3, 4, 5], k: 2 };

export function buildTrace(input: { values: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, k } = input;

  rec
    .begin({
      zh: `原链表：${values.join(' → ')}，左旋 ${k}`,
      en: `List: ${values.join(' → ')}, rotate left by ${k}`,
    })
    .setAux([
      { label: 'n', value: String(values.length) },
      { label: 'k', value: String(k), role: 'pivot' },
    ])
    .commit();

  const hooks: RotateLeftHooks = {
    onNewHead: (v) => {
      rec
        .begin({ zh: `新头：${v}`, en: `New head: ${v}` })
        .setAux([{ label: 'newHead', value: String(v), role: 'compare' }])
        .commit();
    },
    onCut: (cutValue) => {
      rec
        .begin({ zh: `断开：${cutValue} → null`, en: `Cut: ${cutValue} → null` })
        .setAux([{ label: 'cutAfter', value: String(cutValue), role: 'swap' }])
        .commit();
    },
  };

  const newHead = rotateLeft(buildList(values), k, hooks);
  const result = listToArray(newHead);

  rec
    .begin({ zh: `结果：${result.join(' → ')}`, en: `Result: ${result.join(' → ')}` })
    .setAux([{ label: 'result', value: result.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
