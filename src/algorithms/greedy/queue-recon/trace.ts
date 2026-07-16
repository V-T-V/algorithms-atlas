// 队列重建 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { queueRecon, type Person, type QueueReconHooks } from './impl.ts';

export interface QrInput {
  people: Person[];
}

export const DEFAULT_INPUT: QrInput = {
  people: [
    { h: 7, k: 0 },
    { h: 4, k: 4 },
    { h: 7, k: 1 },
    { h: 5, k: 0 },
    { h: 6, k: 1 },
    { h: 5, k: 2 },
  ],
};

/** 录制演示帧序列。 */
export function buildTrace(input: QrInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { people } = input;

  rec
    .begin({ zh: `${people.length} 个人的 [h,k]`, en: `${people.length} people [h,k]` })
    .setBars(people.map((p) => ({ value: p.h, role: 'default' as BarRole })))
    .commit();

  const hooks: QueueReconHooks = {
    onInsert: () => {
      void 0;
    },
  };
  const { queue } = queueRecon(people, hooks);

  rec
    .begin({ zh: `完成：重建队列`, en: `Done: reconstructed queue` })
    .setBars(queue.map((p) => ({ value: p.h, role: 'final' as BarRole })))
    .setMap(
      queue.map((p, i) => ({ key: `${i}`, value: `[${p.h},${p.k}]`, role: 'final' as BarRole })),
    )
    .commit();

  return rec.build();
}
