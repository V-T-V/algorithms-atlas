// =============================================================================
// 链表的中间节点 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, middleNode, type MiddleNodeHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);

  rec
    .begin({ zh: `初始链表：${input.join(' → ')}`, en: `Initial list: ${input.join(' → ')}` })
    .setAux([
      { label: 'slow', value: String(input[0]), role: 'compare' },
      { label: 'fast', value: String(input[0]), role: 'swap' },
    ])
    .commit();

  let step = 0;
  const hooks: MiddleNodeHooks = {
    onStep: (sv, fv) => {
      step++;
      rec
        .begin({ zh: `第 ${step} 步`, en: `Step ${step}` })
        .setAux([
          { label: 'slow', value: String(sv), role: 'compare' },
          { label: 'fast', value: Number.isNaN(fv) ? 'null' : String(fv), role: 'swap' },
        ])
        .commit();
    },
  };

  const mid = middleNode(head, hooks);

  rec
    .begin({
      zh: `中间节点：${mid ? mid.value : 'null'}`,
      en: `Middle node: ${mid ? mid.value : 'null'}`,
    })
    .setAux([{ label: 'middle', value: mid ? String(mid.value) : 'null', role: 'final' }])
    .commit();
  return rec.build();
}
