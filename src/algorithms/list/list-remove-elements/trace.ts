// =============================================================================
// 移除链表元素 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, removeElements, type RemoveElementsHooks } from './impl.ts';

export const DEFAULT_INPUT = { values: [1, 2, 6, 3, 4, 5, 6], val: 6 };

export function buildTrace(input: { values: number[]; val: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, val } = input;
  let removed = 0;

  rec
    .begin({
      zh: `初始：${values.join(' → ')}，删除值 ${val}`,
      en: `Initial: ${values.join(' → ')}, remove ${val}`,
    })
    .setAux([
      { label: 'val', value: String(val), role: 'pivot' },
      { label: 'removed', value: '0', role: 'swap' },
    ])
    .commit();

  const hooks: RemoveElementsHooks = {
    onRemove: (v) => {
      removed++;
      rec
        .begin({
          zh: `删除节点 ${v}（累计 ${removed}）`,
          en: `Remove node ${v} (${removed} total)`,
        })
        .setAux([{ label: 'removed', value: String(removed), role: 'swap' }])
        .commit();
    },
  };

  const result = removeElements(buildList(values), val, hooks);
  const arr = listToArray(result);

  rec
    .begin({ zh: `结果：${arr.join(' → ')}`, en: `Result: ${arr.join(' → ')}` })
    .setAux([{ label: 'result', value: arr.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
