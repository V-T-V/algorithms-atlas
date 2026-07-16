// 蓄水池抽样 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { reservoirSampling, type ReservoirHooks } from './impl.ts';

export const DEFAULT_INPUT = { stream: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], k: 3, seed: 7 };

export function buildTrace(
  input: { stream: number[]; k: number; seed?: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { stream, k, seed = 7 } = input;
  let reservoir: number[] = [];
  let curIdx = -1;

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = stream.map((v) => (reservoir.includes(v) ? 'final' : 'default'));
    if (curIdx >= 0) {
      roles[curIdx] = roles[curIdx] === 'final' ? 'swap' : 'compare';
    }
    const pointers: Array<{ index: number; label: string }> = [];
    if (curIdx >= 0) pointers.push({ index: curIdx, label: 'i' });
    rec
      .begin(note)
      .setArray([...stream], roles, pointers)
      .setAux([
        { label: 'k', value: String(k), role: 'pivot' as BarRole },
        { label: '蓄水池', value: `[${reservoir.join(', ')}]`, role: 'compare' as BarRole },
        { label: '池大小', value: `${reservoir.length}/${k}`, role: 'frontier' as BarRole },
      ])
      .commit();
  };

  render({
    zh: `流大小未知，蓄水池容量 k=${k}`,
    en: `Unknown stream size, reservoir capacity k=${k}`,
  });

  const hooks: ReservoirHooks = {
    onFill: (i, v) => {
      reservoir.push(v);
      curIdx = i;
      render({ zh: `i=${i} < k：直接放入蓄水池`, en: `i=${i} < k: fill reservoir` });
    },
    onConsider: (i, v, kept, slot) => {
      curIdx = i;
      if (kept) {
        // 同步本地 reservoir
        reservoir[slot] = v;
      }
      render({
        zh: kept ? `i=${i}：以 k/i 概率保留 → 替换位置 ${slot}` : `i=${i}：未保留（j >= k）`,
        en: kept
          ? `i=${i}: kept with prob k/i → replace slot ${slot}`
          : `i=${i}: not kept (j >= k)`,
      });
    },
    onResult: (r) => {
      reservoir = [...r];
    },
  };

  reservoirSampling(stream, k, seed, hooks);

  rec
    .begin({
      zh: `完成：蓄水池 [${reservoir.join(', ')}]`,
      en: `Done: reservoir [${reservoir.join(', ')}]`,
    })
    .setArray(
      [...stream],
      stream.map((v) => (reservoir.includes(v) ? 'final' : 'sorted') as BarRole),
      [],
    )
    .setAux([{ label: '结果', value: `[${reservoir.join(', ')}]`, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
