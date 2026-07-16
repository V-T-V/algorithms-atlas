// =============================================================================
// 带随机指针深拷贝（穿插法）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  buildRandomList,
  copyWithRandom2,
  randomListToArray,
  type CopyWithRandom2Hooks,
} from './impl.ts';

export const DEFAULT_INPUT = {
  values: [7, 13, 11, 10, 1],
  randomIndex: [null, 0, 4, 2, 0] as Array<number | null>,
};

export function buildTrace(
  input: { values: number[]; randomIndex: Array<number | null> } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { values, randomIndex } = input;
  const head = buildRandomList(values, randomIndex);

  rec
    .begin({
      zh: `原链表：${values.join(' → ')}，random=${randomIndex.map((r) => (r === null ? '∅' : r)).join(',')}`,
      en: `Original: ${values.join(' → ')}, random=${randomIndex.map((r) => (r === null ? '∅' : r)).join(',')}`,
    })
    .setAux([{ label: 'phase', value: 'start', role: 'frontier' }])
    .commit();

  const hooks: CopyWithRandom2Hooks = {
    onWeave: (o, c) => {
      rec
        .begin({ zh: `穿插：原 ${o} → 拷 ${c}`, en: `Weave: orig ${o} → copy ${c}` })
        .setAux([
          { label: 'phase', value: 'weave', role: 'pivot' },
          { label: 'orig', value: String(o), role: 'compare' },
          { label: 'copy', value: String(c), role: 'swap' },
        ])
        .commit();
    },
    onRandomLink: (cv, pointsTo) => {
      rec
        .begin({
          zh: `拷 ${cv} 的 random → ${pointsTo ?? 'null'}`,
          en: `Copy ${cv} random → ${pointsTo ?? 'null'}`,
        })
        .setAux([
          { label: 'phase', value: 'random', role: 'pivot' },
          { label: 'copy', value: String(cv), role: 'swap' },
          {
            label: 'pointsTo',
            value: pointsTo === null ? 'null' : String(pointsTo),
            role: 'compare',
          },
        ])
        .commit();
    },
    onSplit: (count) => {
      rec
        .begin({ zh: `分离，共 ${count} 个拷贝节点`, en: `Split: ${count} copies` })
        .setAux([{ label: 'phase', value: 'split', role: 'frontier' }])
        .commit();
    },
  };

  const result = copyWithRandom2(head, hooks);
  const arr = randomListToArray(result);

  rec
    .begin({
      zh: `完成：${arr.map((x) => `${x.value}/r=${x.random ?? '∅'}`).join(', ')}`,
      en: `Done: ${arr.map((x) => `${x.value}/r=${x.random ?? '∅'}`).join(', ')}`,
    })
    .setAux([{ label: 'result', value: arr.map((x) => x.value).join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
