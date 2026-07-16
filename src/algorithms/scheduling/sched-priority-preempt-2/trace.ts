// 优先级抢占调度 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityPreemptive, type PriorityProcess } from './impl.ts';

export const DEFAULT_INPUT = {
  procs: [
    { pid: 'P1', arrival: 0, burst: 4, priority: 2 },
    { pid: 'P2', arrival: 1, burst: 3, priority: 1 },
    { pid: 'P3', arrival: 2, burst: 2, priority: 3 },
  ] as PriorityProcess[],
};

export function buildTrace(input: { procs: PriorityProcess[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `优先级抢占`, en: `Priority preemptive` })
    .setBars(
      input.procs.map((p) => ({
        value: p.burst,
        role: 'pivot' as BarRole,
        label: `${p.pid}(p${p.priority})`,
      })),
    )
    .commit();

  const hooks = {
    onDispatch: (pid: string, prio: number, time: number) => {
      rec
        .begin({
          zh: `t=${time} → ${pid}（优先级 ${prio}）`,
          en: `t=${time} → ${pid} (prio ${prio})`,
        })
        .setBars(
          input.procs.map((p) => ({
            value: p.burst,
            role: (p.pid === pid ? 'compare' : 'default') as BarRole,
            label: `${p.pid}(p${p.priority})`,
          })),
        )
        .setAux([{ label: '运行', value: pid, role: 'final' as BarRole }])
        .commit();
    },
  };

  const result = priorityPreemptive(input.procs, hooks);

  rec
    .begin({
      zh: `平均等待 ${result.avgWaiting.toFixed(2)}`,
      en: `Avg wait ${result.avgWaiting.toFixed(2)}`,
    })
    .setAux([{ label: 'avgWait', value: result.avgWaiting.toFixed(2), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
