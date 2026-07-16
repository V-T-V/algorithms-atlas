// =============================================================================
// 队列重建 II · 录制帧序列
// 可视化：setArray 渲染当前队列（空位用 0）；setAux 展示放置过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { queueRecon2, type Person2, type QueueRecon2Hooks } from './impl.ts';

export type Qr2Input = ReadonlyArray<readonly [number, number]>;
export const DEFAULT_INPUT: Qr2Input = [
  [7, 0],
  [4, 4],
  [7, 1],
  [5, 0],
  [6, 1],
  [5, 2],
];

/** 录制演示帧序列。 */
export function buildTrace(input: Qr2Input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const slots: Array<Person2 | null> = new Array(n).fill(null);

  const render = (note: { zh: string; en: string }, highlight: number | null): void => {
    const values = slots.map((s) => (s ? s.h : 0));
    const roles: BarRole[] = slots.map((s, i) => {
      if (s === null) return 'default';
      if (i === highlight) return 'swap';
      return 'sorted';
    });
    rec
      .begin(note)
      .setArray(values, roles, highlight !== null ? [{ index: highlight, label: '放入' }] : [])
      .setAux([
        {
          label: '队列',
          value: slots.map((s) => (s ? `[${s.h},${s.k}]` : '·')).join(' '),
          role: 'default',
        },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `队列重建（计数法）：${n} 个 [h,k]，按身高升序占空位`,
      en: `Queue reconstruction (slot counting): ${n} [h,k], place by ascending height`,
    })
    .setArray(new Array(n).fill(0), new Array(n).fill('default' as BarRole), [])
    .commit();

  const hooks: QueueRecon2Hooks = {
    onPlace: (person, _slot, pos, s) => {
      slots.length = 0;
      for (const x of s) slots.push(x);
      render(
        {
          zh: `放入 [${person.h},${person.k}] 到第 ${person.k} 个空位（下标 ${pos}）`,
          en: `Place [${person.h},${person.k}] at slot ${person.k} (idx ${pos})`,
        },
        pos,
      );
    },
  };

  const result = queueRecon2(input, hooks);

  rec
    .begin({
      zh: `完成：[${result.queue.map((p) => `[${p.h},${p.k}]`).join(', ')}]`,
      en: `Done: [${result.queue.map((p) => `[${p.h},${p.k}]`).join(', ')}]`,
    })
    .setArray(
      result.queue.map((p) => p.h),
      result.queue.map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      {
        label: '结果',
        value: result.queue.map((p) => `[${p.h},${p.k}]`).join(' '),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
