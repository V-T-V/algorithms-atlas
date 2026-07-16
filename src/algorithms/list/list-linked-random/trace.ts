// =============================================================================
// 链表随机节点（蓄水池）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, getRandom, type GetRandomHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  let chosen = input[0]!;

  rec
    .begin({ zh: `链表：${input.join(' → ')}`, en: `List: ${input.join(' → ')}` })
    .setAux([
      { label: 'current', value: String(input[0]), role: 'frontier' },
      { label: 'rule', value: '1/i 概率替换' },
    ])
    .commit();

  // 确定性 rng 让展示可复现：i==2 替换，i==3 保留…… 取一个简单种子
  let seed = 0;
  const rng = (): number => {
    seed = (seed + 0.37) % 1;
    return seed;
  };

  const hooks: GetRandomHooks = {
    onKeep: (i, v) => {
      chosen = v;
      rec
        .begin({ zh: `i=${i}：替换为 ${v}`, en: `i=${i}: replace with ${v}` })
        .setAux([
          { label: 'i', value: String(i), role: 'pivot' },
          { label: 'value', value: String(v), role: 'swap' },
          { label: 'current', value: String(chosen), role: 'frontier' },
        ])
        .commit();
    },
  };

  const result = getRandom(head, hooks, rng);

  rec
    .begin({ zh: `最终选中：${result}`, en: `Chosen: ${result}` })
    .setAux([{ label: 'chosen', value: String(result), role: 'final' }])
    .commit();
  return rec.build();
}
