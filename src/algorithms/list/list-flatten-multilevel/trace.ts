// =============================================================================
// 多级双向链表扁平化 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildMultilevel, flattenMultilevel, multiListToArray, type FlattenHooks } from './impl.ts';

// 1 - 2 - 3 - 4 - 5
//         |
//         6 - 7 - 8
export const DEFAULT_INPUT = {
  values: [1, 2, 3, 4, 5, 6, 7, 8],
  childMap: { 2: 5 }, // 节点值 3 (索引2) 的 child 指向 值 6 (索引5)
};

export function buildTrace(
  input: { values: number[]; childMap: Record<number, number> } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { values, childMap } = input;
  const head = buildMultilevel(values, childMap);

  rec
    .begin({
      zh: `多级链表顶层：${values.join(' → ')}`,
      en: `Multilevel list top level: ${values.join(' → ')}`,
    })
    .setAux([
      { label: 'values', value: values.join(' → '), role: 'frontier' },
      { label: 'childMap', value: JSON.stringify(childMap) },
    ])
    .commit();

  const hooks: FlattenHooks = {
    onSplice: (parentValue, childHeadValue) => {
      rec
        .begin({
          zh: `${parentValue} 的子链插入，子链头 ${childHeadValue}`,
          en: `Splice child list of ${parentValue}, head ${childHeadValue}`,
        })
        .setAux([
          { label: 'parent', value: String(parentValue), role: 'compare' },
          { label: 'childHead', value: String(childHeadValue), role: 'swap' },
        ])
        .commit();
    },
  };

  const result = flattenMultilevel(head, hooks);
  const arr = multiListToArray(result);

  rec
    .begin({ zh: `扁平化结果：${arr.join(' → ')}`, en: `Flattened: ${arr.join(' → ')}` })
    .setAux([{ label: 'result', value: arr.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
