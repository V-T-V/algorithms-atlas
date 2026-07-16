// =============================================================================
// 删除链表中间节点 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, deleteMiddle, type DeleteMiddleHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始链表：${input.join(' → ')}`, en: `Initial list: ${input.join(' → ')}` })
    .setAux([{ label: 'list', value: input.join(' → '), role: 'frontier' }])
    .commit();

  const hooks: DeleteMiddleHooks = {
    onFound: (v) => {
      rec
        .begin({ zh: `定位中点：${v}`, en: `Found middle: ${v}` })
        .setAux([{ label: 'middle', value: String(v), role: 'pivot' }])
        .commit();
    },
    onDelete: (v) => {
      rec
        .begin({ zh: `删除节点 ${v}`, en: `Delete node ${v}` })
        .setAux([{ label: 'deleted', value: String(v), role: 'swap' }])
        .commit();
    },
  };

  const result = deleteMiddle(buildList(input), hooks);
  const arr = listToArray(result);

  rec
    .begin({ zh: `结果：${arr.join(' → ')}`, en: `Result: ${arr.join(' → ')}` })
    .setAux([{ label: 'result', value: arr.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
