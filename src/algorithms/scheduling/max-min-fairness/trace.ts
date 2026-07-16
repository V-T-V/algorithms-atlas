// 最大-最小公平分配 · 录制帧序列
// 用 setBars 展示各方分配 vs 需求，用 setAux 展示剩余容量。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxMinFairness, type MmfHooks, type MmfParty } from './impl.ts';

export const DEFAULT_INPUT = {
  parties: [
    { id: 'A', demand: 30 },
    { id: 'B', demand: 10 },
    { id: 'C', demand: 60 },
    { id: 'D', demand: 40 },
  ],
  capacity: 100,
};

export function buildTrace(
  input: { parties: MmfParty[]; capacity: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const allocs = input.parties.map((p) => ({
    id: p.id,
    demand: p.demand,
    allocated: 0,
    saturated: false,
  }));
  let remaining = input.capacity;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = allocs.map((a) => ({
      value: a.allocated,
      role: (a.saturated ? 'final' : 'frontier') as BarRole,
      label: `${a.id}:${a.allocated.toFixed(1)}/${a.demand}`,
    }));
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: '剩余容量', value: remaining.toFixed(2), role: 'pivot' as BarRole },
        { label: '总容量', value: String(input.capacity), role: 'compare' as BarRole },
      ])
      .commit();
  };

  snapshot({
    zh: `总容量 ${input.capacity}，${allocs.length} 方`,
    en: `Capacity ${input.capacity}, ${allocs.length} parties`,
  });

  const hooks: MmfHooks = {
    onRound: (_r, level, rem, active) => {
      const activeIds = new Set(allocs.filter((a) => !a.saturated).map((a) => a.id));
      for (const a of allocs) {
        if (activeIds.has(a.id)) a.allocated += level;
      }
      remaining = rem;
      void active;
      snapshot({ zh: `本轮均分 +${level.toFixed(2)}`, en: `Round fill +${level.toFixed(2)}` });
    },
    onSaturate: (p) => {
      const a = allocs.find((x) => x.id === p.id);
      if (a) {
        a.allocated = p.demand;
        a.saturated = true;
      }
    },
  };

  maxMinFairness(input.parties, input.capacity, hooks);
  // 同步最终状态
  const result = maxMinFairness(input.parties, input.capacity);
  for (const a of allocs) {
    const r = result.allocations.find((x) => x.id === a.id)!;
    a.allocated = r.allocated;
    a.saturated = r.saturated;
  }
  remaining = input.capacity - result.totalAllocated;

  rec
    .begin({ zh: `分配完成`, en: `Allocation complete` })
    .setBars(
      allocs.map((a) => ({
        value: a.allocated,
        role: 'final' as BarRole,
        label: `${a.id}:${a.allocated.toFixed(1)}/${a.demand}`,
      })),
    )
    .setAux([
      { label: '总分配', value: result.totalAllocated.toFixed(2), role: 'final' as BarRole },
      { label: '全饱和', value: String(result.allSaturated), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
