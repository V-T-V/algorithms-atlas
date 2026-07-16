// =============================================================================
// 步幅调度 · 录制帧序列
// 用 setBars 展示各进程 passes 值（柱高=passes，最小者高亮），setAux 展示被选次数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { strideScheduling, type StrideHooks, type StrideTask } from './impl.ts';

export const DEFAULT_INPUT = {
  tasks: [
    { id: 'A', weight: 1 },
    { id: 'B', weight: 2 },
    { id: 'C', weight: 3 },
  ] as StrideTask[],
  steps: 12,
};

export function buildTrace(input: { tasks: StrideTask[]; steps: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { tasks, steps } = input;

  const passes = new Map<string, number>();
  const picks = new Map<string, number>();
  for (const t of tasks) {
    passes.set(t.id, 0);
    picks.set(t.id, 0);
  }
  let runningId = '';

  const snapshot = (note: { zh: string; en: string }): void => {
    const minPasses = Math.min(...[...passes.values()]);
    const bars = tasks.map((t) => {
      const p = passes.get(t.id) ?? 0;
      let role: BarRole = 'default';
      if (t.id === runningId) role = 'pivot';
      else if (p === minPasses) role = 'compare';
      return { value: p, role, label: `${t.id}(w=${t.weight},passes=${p})` };
    });
    const aux = [
      ...tasks.map((t) => ({
        label: `${t.id} (w=${t.weight}) 被选`,
        value: String(picks.get(t.id) ?? 0),
        role: (t.id === runningId ? 'pivot' : 'frontier') as BarRole,
      })),
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
    runningId = '';
  };

  snapshot({
    zh: `共 ${tasks.length} 个进程，运行 ${steps} 步`,
    en: `${tasks.length} tasks, ${steps} steps`,
  });

  const wrappedHooks: StrideHooks = {
    onPick: (id, before, after) => {
      runningId = id;
      passes.set(id, after);
      picks.set(id, (picks.get(id) ?? 0) + 1);
      void before;
      snapshot({ zh: `选 ${id} 运行（passes=${after}）`, en: `Pick ${id} (passes=${after})` });
    },
  };

  strideScheduling(tasks, steps, wrappedHooks);

  // 终态
  rec
    .begin({
      zh: `完成：被选比例 ≈ ${tasks.map((t) => `${t.id}:${picks.get(t.id)}`).join(' ')}`,
      en: `Done: pick ratio ≈ ${tasks.map((t) => `${t.id}:${picks.get(t.id)}`).join(' ')}`,
    })
    .setBars(
      tasks.map((t) => ({
        value: picks.get(t.id) ?? 0,
        role: 'final' as BarRole,
        label: `${t.id}(w=${t.weight},picks=${picks.get(t.id)})`,
      })),
    )
    .setAux(
      tasks.map((t) => ({
        label: `${t.id} 权重 ${t.weight}`,
        value: `被选 ${picks.get(t.id)} 次`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
